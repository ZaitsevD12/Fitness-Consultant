import React, { useState } from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { NavLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/user-api';

const Login=()=>{
    const dispatch=useDispatch()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };

  
    const handleSubmit = (event) => {
      event.preventDefault();
      dispatch(login(email,password))

    };

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto", }
    const avatarStyle={backgroundColor:'rgb(255, 38, 37)'}
    const btnstyle={margin:'8px 0', background: 'rgb(255, 38, 37)', color: 'white'}
const isAuth = useSelector(state => state.auth.isAuth);
if (isAuth) return <Navigate to='/'/>
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Вход</h2>
                </Grid>
                <form onSubmit={handleSubmit}>
                <TextField label='Email' placeholder='Введите почту' fullWidth required value={email} onChange={handleEmailChange}/>
                <TextField label='Password' placeholder='Введите пароль' type='password' fullWidth required value={password} onChange={handlePasswordChange}/>
                <FormControlLabel
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Запомнить меня"
                 />
                <Button type='submit' variant="contained" style={btnstyle} fullWidth>Войти</Button>
                </form>
                <Typography > Нет аккаунта ?
                <NavLink to="/register" style={{textDecoration: 'none', color: '#3f51b5'}}> Регистрация</NavLink>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login