/**
 * Proof of Work utilities for UTAAB Anti-bot system
 * Client-side computational challenge to prevent automated attacks
 */

export interface ProofOfWorkChallenge {
  challenge: string;
  difficulty: number;
}

export interface ProofOfWorkSolution {
  challenge: string;
  nonce: string;
  difficulty: number;
}

/**
 * Hash a string using SHA-256
 */
async function sha256(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Solve a proof of work challenge
 * Finds a nonce that produces a hash with the required number of leading zeros
 * 
 * @param challenge - The challenge string from the server
 * @param difficulty - Number of leading zeros required
 * @param onProgress - Optional callback for progress updates
 * @returns The solution with the valid nonce
 */
export async function solveProofOfWork(
  challenge: string,
  difficulty: number,
  onProgress?: (attempts: number) => void
): Promise<ProofOfWorkSolution> {
  const targetPrefix = '0'.repeat(difficulty);
  let nonce = 0;
  const startTime = Date.now();
  const maxAttempts = 10000000; // Safety limit

  while (nonce < maxAttempts) {
    const hash = await sha256(`${challenge}:${nonce}`);
    
    if (hash.startsWith(targetPrefix)) {
      console.log(`[PoW] Solved in ${nonce} attempts, ${Date.now() - startTime}ms`);
      return {
        challenge,
        nonce: String(nonce),
        difficulty
      };
    }

    nonce++;

    // Report progress every 1000 attempts
    if (onProgress && nonce % 1000 === 0) {
      onProgress(nonce);
    }

    // Yield to prevent blocking UI
    if (nonce % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  throw new Error('Failed to solve proof of work within attempt limit');
}

/**
 * Estimate time to solve based on difficulty
 * Returns estimated milliseconds
 */
export function estimateSolveTime(difficulty: number): number {
  // Average attempts = 16^difficulty / 2
  const avgAttempts = Math.pow(16, difficulty) / 2;
  // Assume ~50000 hashes per second on average device
  const hashesPerSecond = 50000;
  return (avgAttempts / hashesPerSecond) * 1000;
}

/**
 * Verify a proof of work solution (client-side check)
 */
export async function verifyProofOfWork(solution: ProofOfWorkSolution): Promise<boolean> {
  const hash = await sha256(`${solution.challenge}:${solution.nonce}`);
  const targetPrefix = '0'.repeat(solution.difficulty);
  return hash.startsWith(targetPrefix);
}
