import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import './Register.css'

function Register() {	
	const [logininfo,setLogininfo] = useState({llogin:'',lpass:''});
	const [registerinfo,setRegisterinfo] = useState({rlogin:'',rpass:'',passcheck:''});
	const navigate = useNavigate();
	const loginch = (e) => {
		const {name, value} = e.target;
		setLogininfo(prev => ({
			...prev, [name]:value
		}));
	}
	const regch = (e) => {
		const {name, value} = e.target;
		setRegisterinfo(prev => ({
			...prev, [name]:value
		}));
	} 
	const login = (e) => {
		e.preventDefault();
		let formData = new FormData();
		Object.entries(logininfo).forEach(([key,value]) => {
			formData.append(key,value);
		});
		let xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open('POST','http://94.183.234.114/server/login.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				if(response.success){
					navigate('/');
				}
				else{
					console.log(response.message);
				}
			}
			else{
				console.log('Ошибка ', xhr.status);
			}
		}
	}
	const regist = (e) => {
		e.preventDefault();
		let formData = new FormData();
		Object.entries(registerinfo).forEach(([key,value]) => {
			formData.append(key,value);
		});
		let xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open('POST','http://94.183.234.114/server/register.php');
		xhr.send(formData);
		xhr.onload = function(){
			if(xhr.status == 200){
				let response = JSON.parse(xhr.responseText);
				if(response.success == false){
					console.log(response.message)
				}
				else{
					console.log('Вы зарегистрированы')
				}
			}
			else {
				console.log('Ошибка ', xhr.status);
			}
		}
	}
  return (
    <div className="todoapp stack-large">
		<Header name='Computer shop' nonbut={true}/>
			<div id='maingrid'>
                <div></div>
                <div id='l1'>
                    <h3>Войти</h3>
					<hr />
                    <form className="lform" id='lform' onSubmit={login}>
                        <div className="lform">
                            <input type="text" name="llogin" value={logininfo.llogin} onChange={loginch} id="llogin" placeholder='Логин' required />
                        </div>
                        <div className="lform">
                            <input type="password" name="lpass" value={logininfo.lpass} onChange={loginch} id="lpass" placeholder="Пароль" required />
                        </div>
                        <div className="lform">
                            <input type="submit" value="Вход"  className="but" id='lb'/>
                        </div>
                    </form>
                </div>
                <div id='r2'>
                    <h3>Зарегистрироваться</h3>
					<hr />
                    <form className="rform" id='rform' autoComplete="off" onSubmit={regist}>
                        <div className="rform">
                            <input type="text" name="rlogin" value={registerinfo.rlogin} onChange={regch} placeholder='Логин' autoComplete="off" required />
                        </div>
                        <div className="rform">
                            <input type="password" name="rpass" value={registerinfo.rpass} onChange={regch} id="rpass" placeholder='Пароль' autoComplete="new-password" required />
                        </div>
                        <div className="rform">
                            <input type="password" name="passcheck" value={registerinfo.passcheck} onChange={regch} id="passcheck" placeholder= 'Повторите пароль' autoComplete="new-password" required />
                        </div>
                        <div className="rform">
                            <input type="submit" value="Регистрация" className="but" id='rb'/>
                        </div>
                    </form>
                </div>
                <div></div>
            </div>
		<Footer />
	</div>
	)
}

export default Register;