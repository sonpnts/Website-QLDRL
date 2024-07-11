// import React, { useState } from 'react';
// import { GoogleLogin } from 'react-google-login';
// import axios from 'axios';

// const GoogleLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleGoogleLogin = (response) => {
//     const { tokenId } = response;
//     axios.post('/api/google-login/', { token: tokenId })
//       .then(res => {
//         // Handle successful login
//         console.log(res.data);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   };

//   const handleTraditionalLogin = (e) => {
//     e.preventDefault();
//     axios.post('/api/traditional-login/', { username, password })
//       .then(res => {
//         // Handle successful login
//         console.log(res.data);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   };

//   return (
//     <div>
//       <form onSubmit={handleTraditionalLogin}>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <button type="submit">Login</button>
//       </form>
//       <GoogleLogin
//         clientId="YOUR_GOOGLE_CLIENT_ID"
//         buttonText="Login with Google"
//         onSuccess={handleGoogleLogin}
//         onFailure={handleGoogleLogin}
//         cookiePolicy={'single_host_origin'}
//       />
//     </div>
//   );
// };

// export default GoogleLogin;
