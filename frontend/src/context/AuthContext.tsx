import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "Admin" | "Intern";

interface AuthContextType {
  role: Role;
  isAdmin: boolean;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<Role>(
    (localStorage.getItem("userRole") as Role) || "Admin",
  );

  useEffect(() => {
    localStorage.setItem("userRole", role);
  }, [role]);

  const toggleRole = () =>
    setRole((prev) => (prev === "Admin" ? "Intern" : "Admin"));
  const isAdmin = role === "Admin";

  return (
    <AuthContext.Provider value={{ role, isAdmin, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
