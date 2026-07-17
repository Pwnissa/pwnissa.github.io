// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Pwnissa - CTF Team';
export const BLOG_TITLE = 'BLOG Pwnissa - CTF Team';
export const NAV_BRAND = 'Pwnissa';
export const SITE_DESCRIPTION = '';
export const navLinks = [
    { name: "Members", href: "/members" },
    { name: "Blog", href: "/blog" },
    { 
        name: "Training", 
        href: "#",
        subLinks: [
            { name: "Pwnissa Academy", href: "/training/pwnissa-academy" },
            { name: "CyberChallenge.IT", href: "/training/cyberchallenge" }
        ]
    },
]
