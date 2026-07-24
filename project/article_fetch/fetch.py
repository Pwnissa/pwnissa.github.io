#!/usr/bin/env python3
"""
poll_page.py

Repeatedly loads a page (executing its JavaScript via a real Firefox engine)
at randomized intervals, routing each request through Tor and requesting a
fresh circuit (new exit IP) before every fetch. Intended for testing your
own site's logging/analytics/rate-limiting under traffic from many source
IPs.

Requires:
    pip install playwright stem
    playwright install firefox

Requires a running Tor daemon with its control port enabled, e.g. in
/etc/tor/torrc:
    ControlPort 9051
    CookieAuthentication 1
    # or: HashedControlPassword <hash>   (see `tor --hash-password`)

Usage:
    python poll_page.py --url https://your-site.example --min 45 --max 180
    python poll_page.py --url https://your-site.example --tor-password mypassword
"""

import argparse
import hashlib
import random
import sys
import time
from datetime import datetime

from playwright.sync_api import sync_playwright
from stem import Signal
from stem.control import Controller

DEFAULT_URL = "https://life.unige.it/pwnissa-cybercup-2026"
TOR_SOCKS_PROXY = "socks5://127.0.0.1:9050"

# A realistic, current desktop Firefox UA string.
FIREFOX_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) "
    "Gecko/20100101 Firefox/128.0"
)


def log(msg: str) -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def fetch_rendered_html(page, url: str, timeout_ms: int = 30000) -> str:
    """Navigate to the URL, wait for JS to settle, and return rendered HTML."""
    page.goto(url, wait_until="networkidle", timeout=timeout_ms)
    return page.content()


def renew_tor_circuit(control_port: int, password) -> None:
    """Ask Tor for a new circuit, giving us a new exit IP on the next connection."""
    with Controller.from_port(port=control_port) as controller:
        if password:
            controller.authenticate(password=password)
        else:
            controller.authenticate()  # cookie auth
        controller.signal(Signal.NEWNYM)
    # Tor needs a moment to build the new circuit before it's usable.
    time.sleep(5)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL, help="URL to poll")
    parser.add_argument("--min", type=float, default=45,
                         help="Minimum seconds between requests (default 45)")
    parser.add_argument("--max", type=float, default=180,
                         help="Maximum seconds between requests (default 180)")
    parser.add_argument("--once", action="store_true",
                         help="Run a single fetch and exit (useful for testing)")
    parser.add_argument("--tor-control-port", type=int, default=9051,
                         help="Tor ControlPort (default 9051)")
    parser.add_argument("--tor-socks-proxy", default=TOR_SOCKS_PROXY,
                         help="Tor SOCKS5 proxy address (default socks5://127.0.0.1:9050)")
    parser.add_argument("--tor-password", default=None,
                         help="Tor control port password (omit to use cookie auth)")
    parser.add_argument("--no-tor", action="store_true",
                         help="Disable Tor routing/circuit renewal (direct connection)")
    args = parser.parse_args()

    if args.min <= 0 or args.max < args.min:
        log("Error: require 0 < min <= max for the interval range.")
        return 1

    last_hash = None

    with sync_playwright() as p:
        launch_kwargs = {"headless": True}
        if not args.no_tor:
            launch_kwargs["proxy"] = {"server": args.tor_socks_proxy}

        browser = p.firefox.launch(**launch_kwargs)
        context = browser.new_context(user_agent=FIREFOX_UA)
        page = context.new_page()

        try:
            while True:
                try:
                    if not args.no_tor:
                        log("Requesting new Tor circuit...")
                        renew_tor_circuit(args.tor_control_port, args.tor_password)
                        # New circuit only applies to new connections/contexts,
                        # so recycle the browser context to force a fresh socket.
                        page.close()
                        context.close()
                        context = browser.new_context(user_agent=FIREFOX_UA)
                        page = context.new_page()

                    html = fetch_rendered_html(page, args.url)
                    digest = hashlib.sha256(html.encode("utf-8", "ignore")).hexdigest()

                    if last_hash is None:
                        log(f"Initial fetch OK. content_hash={digest[:12]} len={len(html)}")
                    elif digest != last_hash:
                        log(f"CHANGE DETECTED! content_hash={digest[:12]} len={len(html)}")
                    else:
                        log(f"No change. content_hash={digest[:12]}")

                    last_hash = digest

                except Exception as e:
                    log(f"Request failed: {e}")

                if args.once:
                    break

                wait_s = random.uniform(args.min, args.max)
                log(f"Sleeping {wait_s:.1f}s before next check...")
                time.sleep(wait_s)

        except KeyboardInterrupt:
            log("Interrupted by user, shutting down.")
        finally:
            context.close()
            browser.close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
