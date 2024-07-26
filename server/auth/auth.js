// export const checkForAuthentication = (req, res, next) => {
//     const authorizationHeader = req.headers["authorization"]
//     if(!authorizationHeader || !authorizationHeader.startsWith('Bearer')){
//         return next();
//     }

//     const token = authorizationHeader.split(' ')[1];
//     if(!token){
//         return null;
//     } else {
//         try{
//             return token
//         } catch (err){

//         }
//     }

// }