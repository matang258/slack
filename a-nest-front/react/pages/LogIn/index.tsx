import useInput from "@hooks/useInput";
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "@pages/SignUp/style"
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { Link, Redirect } from "react-router-dom";
// import useSWR from 'swr';
import useSWR, { SWRResponse } from 'swr';

const LogIn = () => {
    const { data, error, mutate } = useSWR('/api/users', fetcher);  //data나 errro값이 바뀌면 바로 react 리렌더링 된다고 함 [워크스페이스 만들기 + 로그아웃하기] (8:26)
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setLogInError(false);
            axios
                .post( //근데 왜 로그인하는게 post요청일까. 특이한건위에 SWR요청은 내부보면 get요청이다. [사용자 초대 모달 만들기 7:40에서 설명함. 로그인 로그아웃 등 애매한것들은 전부 POST로 통일했다고]
                    // '/api/users/login',
                    '/api/users/login',
                    { email, password },
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {
                    mutate(response.data, false); //mutate: 서버에 요청 안 보내고 기존 데이터를 데이터를 가져옴 [swr 활용법(optimistic ui)],  false 필수 5:38
                })
                .catch((error) => {
                    setLogInError(error.response?.data?.data.statusCode === 401);
                });

        }, [email, password]
    );

    
    if(data) {
        return <Redirect to="/workspace/sleact/channel/일반" />  //sleact와 일반은 파라미터값
        // return <Redirect to="/workspace/channel" />
    }

    /* console.log(error, userData);
    if(!error && userData) {
        console.log('로그인 됨', usedData);
        return <Redirect to="/workspace/sleact/channel/일반" />;
    } */

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label>
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                    {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
                </Label>
                <Button type="submit">로그인</Button>
            </Form>
            <LinkContainer>
                <Link to="/signup">회원가입 하러가기</Link>
                {/* <a href="/signup">회원가입 하러가기</a> */}
            </LinkContainer>
        </div>    
    
    );
};

/* 
const LogIn = () => {
    return (
        <div>로그인</div>
    )
} */

export default LogIn;