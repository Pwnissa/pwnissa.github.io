---
layout: ../../layouts/BlogLayout.astro
title: "Crittografia Post-Quantistica: Preparasi al Futuro della Sicurezza"
date: 2024-01-05
author: "Ub1k"
tags: ["crypto", "misc"]
---

I computer quantistici rappresentano una minaccia esistenziale per la crittografia attuale. Questo articolo esplora le nuove tecniche crittografiche resistenti agli attacchi quantistici e le loro implicazioni per la sicurezza futura.

## Il Problema Quantistico

### Algoritmi di Shor e Grover

I computer quantistici possono rompere la crittografia attuale usando:

```python
# Simulazione dell'algoritmo di Shor (semplificato)
def shors_algorithm_simulation(N):
    """
    Simulazione concettuale dell'algoritmo di Shor
    per la fattorizzazione di numeri grandi
    """
    import random
    import math
    
    # Scegli un numero casuale a < N
    a = random.randint(2, N-1)
    
    # Calcola gcd(a, N)
    gcd = math.gcd(a, N)
    if gcd > 1:
        return gcd, N // gcd
    
    # In un computer quantistico, qui si userebbe
    # la trasformata di Fourier quantistica per trovare
    # il periodo della funzione f(x) = a^x mod N
    
    # Simulazione del finding del periodo
    period = find_period_classical(a, N)
    
    if period % 2 == 0:
        factor1 = math.gcd(pow(a, period//2) - 1, N)
        factor2 = math.gcd(pow(a, period//2) + 1, N)
        
        if factor1 > 1 and factor2 > 1:
            return factor1, factor2
    
    return None, None

def find_period_classical(a, N):
    """Trova il periodo classicamente (inefficiente)"""
    period = 1
    current = a % N
    
    while current != 1:
        current = (current * a) % N
        period += 1
    
    return period

# Esempio: fattorizzazione di RSA-15
N = 33  # 3 * 11
factor1, factor2 = shors_algorithm_simulation(N)
print(f"Fattori di {N}: {factor1}, {factor2}")
```

### Impatto su RSA ed ECC

```python
# Vulnerabilità della crittografia attuale
def rsa_vulnerability():
    """
    RSA-2048 può essere rotto da un computer quantistico
    con circa 4000 qubit logici
    """
    key_size = 2048
    quantum_resources = estimate_quantum_resources(key_size)
    
    print(f"Per rompere RSA-{key_size}:")
    print(f"Qubit necessari: {quantum_resources['qubits']}")
    print(f"Operazioni quantistiche: {quantum_resources['operations']}")
    
def estimate_quantum_resources(key_size):
    """Stima delle risorse quantistiche necessarie"""
    # Stime basate su ricerca accademica
    qubits = key_size * 2  # Approssimazione
    operations = key_size ** 3  # Complessità cubica
    
    return {
        'qubits': qubits,
        'operations': operations
    }

rsa_vulnerability()
```

## Algoritmi Post-Quantistici

### 1. Crittografia Basata su Lattice

```python
# Esempio semplificato di Learning With Errors (LWE)
import numpy as np
import random

class LWE_Cryptosystem:
    def __init__(self, n, q, sigma):
        self.n = n      # Dimensione del lattice
        self.q = q      # Modulo
        self.sigma = sigma  # Deviazione standard del rumore
        
    def keygen(self):
        """Genera chiavi pubbliche e private"""
        # Chiave privata: vettore segreto s
        s = np.random.randint(0, self.q, self.n)
        
        # Matrice A casuale
        A = np.random.randint(0, self.q, (self.n, self.n))
        
        # Rumore e
        e = np.random.normal(0, self.sigma, self.n).astype(int)
        
        # Chiave pubblica: (A, b = As + e)
        b = (A @ s + e) % self.q
        
        return {
            'private_key': s,
            'public_key': (A, b)
        }
    
    def encrypt(self, public_key, message):
        """Crittografa un messaggio"""
        A, b = public_key
        
        # Vettore casuale r
        r = np.random.randint(0, 2, self.n)
        
        # Crittogramma
        c1 = (A.T @ r) % self.q
        c2 = (b @ r + message * (self.q // 2)) % self.q
        
        return (c1, c2)
    
    def decrypt(self, private_key, ciphertext):
        """Decrittografa un messaggio"""
        s = private_key
        c1, c2 = ciphertext
        
        # Recupera il messaggio
        noise = (c2 - s @ c1) % self.q
        
        # Decisione basata sulla vicinanza
        if noise < self.q // 4 or noise > 3 * self.q // 4:
            return 0
        else:
            return 1

# Esempio d'uso
lwe = LWE_Cryptosystem(n=512, q=2053, sigma=8)
keys = lwe.keygen()

# Crittografia
message = 1
ciphertext = lwe.encrypt(keys['public_key'], message)
decrypted = lwe.decrypt(keys['private_key'], ciphertext)

print(f"Messaggio originale: {message}")
print(f"Messaggio decrittografato: {decrypted}")
```

### 2. Crittografia Basata su Codici

```python
# Implementazione semplificata di McEliece
class McEliece:
    def __init__(self, n, k, t):
        self.n = n  # Lunghezza del codice
        self.k = k  # Dimensione del messaggio
        self.t = t  # Capacità di correzione errori
        
    def keygen(self):
        """Genera chiavi McEliece"""
        # Matrice generatrice G di un codice Goppa
        G = self.generate_goppa_matrix()
        
        # Matrice di permutazione P
        P = self.generate_permutation_matrix()
        
        # Matrice non-singolare S
        S = self.generate_nonsingular_matrix()
        
        # Chiave pubblica: G' = SGP
        G_public = (S @ G @ P) % 2
        
        return {
            'private_key': (G, S, P),
            'public_key': G_public
        }
    
    def generate_goppa_matrix(self):
        """Genera matrice generatrice di un codice Goppa"""
        # Semplificazione: matrice casuale con proprietà specifiche
        G = np.random.randint(0, 2, (self.k, self.n))
        
        # Assicura che G sia in forma sistematica
        G[:, :self.k] = np.eye(self.k)
        
        return G
    
    def generate_permutation_matrix(self):
        """Genera matrice di permutazione"""
        P = np.zeros((self.n, self.n))
        perm = np.random.permutation(self.n)
        
        for i, j in enumerate(perm):
            P[i, j] = 1
            
        return P
    
    def generate_nonsingular_matrix(self):
        """Genera matrice non-singolare"""
        while True:
            S = np.random.randint(0, 2, (self.k, self.k))
            if np.linalg.det(S) != 0:
                return S
    
    def encrypt(self, public_key, message):
        """Crittografa usando McEliece"""
        G_public = public_key
        
        # Codifica il messaggio
        codeword = (message @ G_public) % 2
        
        # Aggiungi errori casuali
        error_vector = np.zeros(self.n)
        error_positions = np.random.choice(self.n, self.t, replace=False)
        error_vector[error_positions] = 1
        
        # Crittogramma
        ciphertext = (codeword + error_vector) % 2
        
        return ciphertext

# Esempio d'uso
mceliece = McEliece(n=1024, k=524, t=50)
keys = mceliece.keygen()

message = np.random.randint(0, 2, 524)
ciphertext = mceliece.encrypt(keys['public_key'], message)

print(f"Messaggio di {len(message)} bit crittografato in {len(ciphertext)} bit")
```

### 3. Crittografia Multivariata

```python
# Sistema crittografico multivariato semplificato
class MultivariateSystem:
    def __init__(self, n, m):
        self.n = n  # Numero di variabili
        self.m = m  # Numero di equazioni
        
    def keygen(self):
        """Genera chiavi per sistema multivariato"""
        # Sistema centrale F (facile da invertire)
        F = self.generate_central_system()
        
        # Trasformazioni affini S e T
        S = self.generate_affine_transformation(self.n)
        T = self.generate_affine_transformation(self.m)
        
        # Chiave pubblica: P = T ∘ F ∘ S
        P = self.compose_transformations(T, F, S)
        
        return {
            'private_key': (F, S, T),
            'public_key': P
        }
    
    def generate_central_system(self):
        """Genera sistema centrale (Oil and Vinegar)"""
        # Variabili Oil e Vinegar
        oil_vars = self.n // 2
        vinegar_vars = self.n - oil_vars
        
        equations = []
        
        for i in range(self.m):
            # Equazione quadratica con struttura Oil-Vinegar
            eq = np.zeros((self.n, self.n))
            
            # Termini vinegar-vinegar
            for j in range(vinegar_vars):
                for k in range(j, vinegar_vars):
                    eq[j, k] = random.randint(0, 255)
            
            # Termini oil-vinegar
            for j in range(oil_vars):
                for k in range(vinegar_vars):
                    eq[vinegar_vars + j, k] = random.randint(0, 255)
            
            equations.append(eq)
        
        return equations
    
    def generate_affine_transformation(self, size):
        """Genera trasformazione affine"""
        # Matrice invertibile
        matrix = np.random.randint(0, 256, (size, size))
        
        # Vettore di traslazione
        vector = np.random.randint(0, 256, size)
        
        return (matrix, vector)
    
    def compose_transformations(self, T, F, S):
        """Compone le trasformazioni T ∘ F ∘ S"""
        # Semplificazione: restituisce rappresentazione simbolica
        return {
            'T': T,
            'F': F,
            'S': S
        }
    
    def sign(self, private_key, message):
        """Firma un messaggio"""
        F, S, T = private_key
        
        # Applica T^(-1)
        y = self.apply_inverse_transformation(T, message)
        
        # Risolvi F(x) = y
        x = self.solve_central_system(F, y)
        
        # Applica S^(-1)
        signature = self.apply_inverse_transformation(S, x)
        
        return signature
    
    def verify(self, public_key, message, signature):
        """Verifica una firma"""
        # Applica il sistema pubblico P
        result = self.evaluate_public_system(public_key, signature)
        
        # Verifica che P(signature) = message
        return np.array_equal(result, message)

# Esempio d'uso
mv_system = MultivariateSystem(n=80, m=80)
keys = mv_system.keygen()

print("Sistema crittografico multivariato generato")
print(f"Variabili: {mv_system.n}, Equazioni: {mv_system.m}")
```

## Standardizzazione NIST

### Algoritmi Selezionati

```python
# Algoritmi standardizzati dal NIST
nist_algorithms = {
    'signatures': {
        'CRYSTALS-Dilithium': {
            'security_level': [2, 3, 5],
            'key_size': [1312, 1952, 2592],  # bytes
            'signature_size': [2420, 3293, 4595]
        },
        'FALCON': {
            'security_level': [1, 5],
            'key_size': [897, 1793],
            'signature_size': [666, 1280]
        },
        'SPHINCS+': {
            'security_level': [1, 3, 5],
            'key_size': [32, 48, 64],
            'signature_size': [7856, 16224, 29792]
        }
    },
    'key_exchange': {
        'CRYSTALS-Kyber': {
            'security_level': [1, 3, 5],
            'key_size': [800, 1184, 1568],
            'ciphertext_size': [768, 1088, 1568]
        }
    }
}

def compare_algorithms():
    """Confronta gli algoritmi post-quantistici"""
    print("Confronto algoritmi post-quantistici NIST:")
    
    for category, algorithms in nist_algorithms.items():
        print(f"\n{category.upper()}:")
        
        for name, specs in algorithms.items():
            print(f"  {name}:")
            print(f"    Livelli di sicurezza: {specs['security_level']}")
            print(f"    Dimensioni chiave: {specs['key_size']} bytes")
            
            if 'signature_size' in specs:
                print(f"    Dimensioni firma: {specs['signature_size']} bytes")
            if 'ciphertext_size' in specs:
                print(f"    Dimensioni ciphertext: {specs['ciphertext_size']} bytes")

compare_algorithms()
```

## Implementazione Pratica

### Integrazione con OpenSSL

```bash
# Installazione liboqs (Open Quantum Safe)
git clone https://github.com/open-quantum-safe/liboqs.git
cd liboqs
mkdir build && cd build
cmake -GNinja ..
ninja
sudo ninja install

# Compilazione con supporto post-quantistico
gcc -o pqc_example pqc_example.c -loqs
```

```c
// Esempio in C con liboqs
#include <stdio.h>
#include <oqs/oqs.h>

int main() {
    // Inizializza Kyber-1024
    OQS_KEM *kem = OQS_KEM_new(OQS_KEM_alg_kyber_1024);
    
    if (kem == NULL) {
        printf("Errore nell'inizializzazione di Kyber\n");
        return 1;
    }
    
    // Genera chiavi
    uint8_t public_key[OQS_KEM_kyber_1024_length_public_key];
    uint8_t secret_key[OQS_KEM_kyber_1024_length_secret_key];
    
    OQS_STATUS status = OQS_KEM_keypair(kem, public_key, secret_key);
    
    if (status != OQS_SUCCESS) {
        printf("Errore nella generazione delle chiavi\n");
        OQS_KEM_free(kem);
        return 1;
    }
    
    // Incapsulamento
    uint8_t ciphertext[OQS_KEM_kyber_1024_length_ciphertext];
    uint8_t shared_secret_alice[OQS_KEM_kyber_1024_length_shared_secret];
    
    status = OQS_KEM_encaps(kem, ciphertext, shared_secret_alice, public_key);
    
    // Decapsulamento
    uint8_t shared_secret_bob[OQS_KEM_kyber_1024_length_shared_secret];
    status = OQS_KEM_decaps(kem, shared_secret_bob, ciphertext, secret_key);
    
    // Verifica che i segreti coincidano
    if (memcmp(shared_secret_alice, shared_secret_bob, 
               OQS_KEM_kyber_1024_length_shared_secret) == 0) {
        printf("Scambio di chiavi riuscito!\n");
    } else {
        printf("Errore nello scambio di chiavi\n");
    }
    
    OQS_KEM_free(kem);
    return 0;
}
```

## Migrazione e Hybrid Systems

### Approccio Ibrido

```python
# Sistema ibrido classico + post-quantistico
class HybridCryptosystem:
    def __init__(self):
        self.classical_system = RSA()
        self.pq_system = Kyber()
    
    def hybrid_keygen(self):
        """Genera chiavi ibride"""
        classical_keys = self.classical_system.keygen()
        pq_keys = self.pq_system.keygen()
        
        return {
            'classical': classical_keys,
            'post_quantum': pq_keys
        }
    
    def hybrid_encrypt(self, keys, message):
        """Crittografia ibrida"""
        # Genera chiave simmetrica casuale
        symmetric_key = os.urandom(32)
        
        # Crittografa il messaggio con AES
        encrypted_message = AES.encrypt(symmetric_key, message)
        
        # Crittografa la chiave simmetrica con entrambi i sistemi
        classical_key_enc = self.classical_system.encrypt(
            keys['classical']['public'], symmetric_key
        )
        pq_key_enc = self.pq_system.encrypt(
            keys['post_quantum']['public'], symmetric_key
        )
        
        return {
            'message': encrypted_message,
            'classical_key': classical_key_enc,
            'pq_key': pq_key_enc
        }
    
    def hybrid_decrypt(self, keys, ciphertext):
        """Decrittografia ibrida"""
        # Prova a decrittografare con il sistema classico
        try:
            symmetric_key = self.classical_system.decrypt(
                keys['classical']['private'], 
                ciphertext['classical_key']
            )
        except:
            # Se fallisce, usa il sistema post-quantistico
            symmetric_key = self.pq_system.decrypt(
                keys['post_quantum']['private'], 
                ciphertext['pq_key']
            )
        
        # Decrittografa il messaggio
        message = AES.decrypt(symmetric_key, ciphertext['message'])
        
        return message
```

## Conclusioni

La transizione alla crittografia post-quantistica è **inevitabile** e **urgente**:

1. **Timeline**: I computer quantistici diventeranno una minaccia reale entro 10-20 anni
2. **Preparazione**: Le organizzazioni devono iniziare la migrazione ora
3. **Approccio graduale**: Sistemi ibridi durante la transizione
4. **Standardizzazione**: Seguire le raccomandazioni NIST

La crittografia post-quantistica non è solo una necessità tecnica, ma una questione di sicurezza nazionale e protezione dei dati a lungo termine.

> **Consiglio**: Iniziate a sperimentare con gli algoritmi post-quantistici nelle vostre applicazioni. La transizione richiederà tempo e preparazione!