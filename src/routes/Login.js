import { useState } from 'react';
import styled from 'styled-components';

import firebase from // createUserWithEmailAndPassword,
// auth,
// signInWithEmailAndPassword,
// db,
// doc,
// setDoc,
'../utils/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
  margin: 10px auto 0;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: solid 1px #1976d2;
  border-radius: 10px;
`;

const StyledBox = styled.div`
  && {
    display: flex;
    align-items: flex-end;
    width: 250px;
    margin-top: 15px;
  }
`;

const StyledStack = styled.div`
  && {
    margin: 30px 0;
    justify-content: space-around;
    width: 250px;
  }
`;

const Login = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    showPassword: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const {
    createUserWithEmailAndPassword,
    auth,
    signInWithEmailAndPassword,
  } = firebase;

  let { from } = location.state || { from: { pathname: '/' } };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        firebase.updateUser(values.name);
        firebase.signUp(user.uid, user.email);
        alert('註冊成功！');
        navigate(from);
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/weak-password') {
          alert('密碼需大於六位數');
        } else if (error.code === 'auth/email-already-in-use') {
          alert('此信箱已是會員，若要登入，請使用登入按鈕');
        } else if (error.code === 'auth/invalid-email') {
          alert('請填寫正確的信箱格式');
        } else {
          alert('註冊失敗，請稍後再試');
        }
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        // Signed in
        // const user = userCredential.user;
        alert('已成功登入！');
        navigate(from);
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          alert('信箱錯誤，請輸入正確的信箱');
        } else if (error.code === 'auth/wrong-password') {
          alert('密碼錯誤，請重新輸入');
        } else if (error.code === 'auth/user-not-found') {
          alert('此信箱帳號非會員，請先註冊');
        } else {
          alert('登入失敗，請稍後再試');
          console.log(error.code, error.message);
        }
      });
  };

  const handleChange = prop => event => {
    setValues(prev => {
      return { ...prev, [prop]: event.target.value };
    });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <Container>
      <StyledBox>
        {/* <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
        <label htmlFor="Name">Name</label>
        <input
          sx={{ width: '218px' }}
          id="Name"
          label="Name"
          value={values.name}
          variant="standard"
          onChange={handleChange('name')}
        />
      </StyledBox>
      <StyledBox>
        {/* <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
        <label htmlFor="Email">Email</label>
        <input
          sx={{ width: '218px' }}
          id="Email"
          label="Email"
          variant="standard"
          value={values.email}
          onChange={handleChange('email')}
        />
      </StyledBox>
      <StyledBox>
        {/* <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
        {/* <FormControl variant="standard"> */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
          />
        {/* </FormControl> */}
      </StyledBox>
      <StyledStack spacing={2} direction="row">
        <button variant="contained" onClick={handleSignUp}>
          Sign Up
        </button>
        <button variant="outlined" onClick={handleSignIn}>
          Sign In
        </button>
      </StyledStack>
    </Container>
  );
};

export default Login;
