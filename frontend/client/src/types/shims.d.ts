declare module '*.jsx' {
  const Component: any;
  export default Component;
}

declare module './context/AuthContext' {
  export const AuthProvider: any;
  export const useAuth: any;
}

