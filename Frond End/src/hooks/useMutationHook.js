import { useMutation } from "@tanstack/react-query"

export const useMutationHooks = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
    })
    return mutation
}

// import { useMutation } from "@tanstack/react-query";
// import { signupUserGoogle, signupUser } from '../services/UserService';

// export const useMutationHooks = (isGoogleSignup = false) => {
//   const mutation = useMutation({
//     mutationFn: isGoogleSignup ? signupUserGoogle : signupUser
//   });
  
//   return mutation;
// };
