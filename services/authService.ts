import type { User } from '../types';

const USERS_KEY = 'registeredUsers';
const CURRENT_USER_KEY = 'currentUser';

// Helper to get users from localStorage
const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

// Helper to save users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generates a simple 6-digit code for simulation
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = (email: string, password_not_used: string): Promise<{ email: string; verificationCode: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate network delay
      const users = getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return reject(new Error('User with this email already exists.'));
      }

      const verificationCode = generateVerificationCode();
      const newUser: User = { 
        email, 
        password: password_not_used, 
        isVerified: false, 
        verificationCode 
      };
      
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      
      console.log(`DEMO: Verification code for ${email} is ${verificationCode}`);
      
      resolve({ email, verificationCode });
    }, 1000);
  });
};

export const loginUser = (email: string, password_not_used: string): Promise<User> => {
  return new Promise((resolve, reject) => {
     setTimeout(() => { // Simulate network delay
      const users = getUsers();
      const user = users.find(u => u.email === email);
      
      if (user && user.password === password_not_used) {
        if (!user.isVerified) {
          return reject(new Error('Account not verified.'));
        }
        const userToStore = { email: user.email };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
        resolve(userToStore);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000);
  });
};

export const verifyUser = (email: string, code: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            return reject(new Error('User not found.'));
        }

        const user = users[userIndex];

        if (user.isVerified) {
            const userToStore = { email: user.email };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
            return resolve(userToStore);
        }

        if (user.verificationCode === code) {
            users[userIndex].isVerified = true;
            delete users[userIndex].verificationCode;
            saveUsers(users);

            const userToStore = { email: user.email };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
            resolve(userToStore);
        } else {
            reject(new Error('Invalid verification code.'));
        }
      }, 1000);
    });
};

export const resendVerificationCode = (email: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            return reject(new Error('User not found.'));
        }
        
        if (users[userIndex].isVerified) {
             return reject(new Error('Account is already verified.'));
        }
        
        const newCode = generateVerificationCode();
        users[userIndex].verificationCode = newCode;
        saveUsers(users);
        
        console.log(`DEMO: New verification code for ${email} is ${newCode}`);
        resolve(newCode);
      }, 1000);
    });
};

export const sendPasswordResetCode = (email: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex === -1) {
                // To prevent email enumeration, we don't reveal if the user exists.
                // We resolve successfully but do nothing.
                console.log(`DEMO: Password reset requested for non-existent user ${email}. Simulating success.`);
                resolve("DEMO_CODE_NOT_SENT");
                return;
            }

            const resetCode = generateVerificationCode();
            const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

            users[userIndex].resetCode = resetCode;
            users[userIndex].resetCodeExpiry = expiry;
            saveUsers(users);

            console.log(`DEMO: Password reset code for ${email} is ${resetCode}`);
            resolve(resetCode);
        }, 1000);
    });
};

export const resetPassword = (email: string, code: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex === -1) {
                return reject(new Error("Invalid reset code or email."));
            }

            const user = users[userIndex];

            if (user.resetCode !== code || !user.resetCodeExpiry || Date.now() > user.resetCodeExpiry) {
                return reject(new Error("Invalid or expired reset code."));
            }

            users[userIndex].password = newPassword;
            delete users[userIndex].resetCode;
            delete users[userIndex].resetCodeExpiry;
            saveUsers(users);

            resolve();
        }, 1000);
    });
};


export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
