import React, { useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "@pages/SignUp/style"
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import useSWR, { SWRResponse } from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {
    const { data, error, mutate } = useSWR('/api/users', fetcher);  //data나 errro값이 바뀌면 바로 react 리렌더링 된다고 함 [워크스페이스 만들기 + 로그아웃하기] (8:26)

    /* 
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [missmatchError, setMissmatchError] = useState(false); //비밀번호 다르면 true */

    const [email, onChangeEmail] = useInput(''); //세번째 변수 setEmail은 필요없어서 제거
    const [nickname, onChangeNickname] = useInput(''); //세번째 변수 setNickname은 필요없어서 제거

    const [password, ,setPassword] = useInput('');  //두번째 변수를 비워두고 onChangePassword를 직접 선언해서 커스터마이징(구조분해할당)
    const [passwordCheck, ,setPasswordCheck] = useInput(''); //두번째 변수를 비워두고 onChangePasswordCheck를 직접 선언해서 커스터마이징
    
    const [missmatchError, setMissmatchError] = useState(false); //비밀번호 다르면 true
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    /* 
    const onChangeEmail = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

    const onChangeNickname = useCallback((e) => {
        setNickname(e.target.value)
    }, []); */

    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
        setMissmatchError(e.target.value !== passwordCheck);
    }, [passwordCheck]);

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value)
        setMissmatchError(e.target.value !== password);
    }, [password]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if(!missmatchError && nickname){
            console.log("서버로 회원가입하기");
            setSignUpError(''); //요청에 관련해서 state변경해주는게 있으면 요청 보내기 전에 초기화
            setSignUpSuccess(false); //요청에 관련해서 state변경해주는게 있으면 요청 보내기 전에 초기화

            axios.post('/api/users', {
            // axios.post('/api/users', {
                email,
                nickname,
                password
            })
            .then((response1) => {
                console.log(response1);
                setSignUpSuccess(true);
            })
            .catch((error) => {
                // console.log("에러",error.response);
                console.log("에러",error.response.data); 
                setSignUpError(error.response?.data.data); //강좌에는 error.response.data로 접근하는데 나는 data.data로 접근해야함(nest로 만든 백엔드는 그렇게 넘겨줌)
            })
            .finally(() => {});
        }
        console.log(email, nickname, password, passwordCheck)
    }, [email, nickname, password, passwordCheck, missmatchError]);


    
    if(data === undefined){
        // return <div>로딩중...</div>
    }
    if(data) {
        return <Redirect to="/workspace/sleact/channel/일반" />
        // return <Redirect to="/workspace/channel" />
    }

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail}/>
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname}/>
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword}/>
                    </div>
                </Label>
                <Label>
                    <span>비밀번호 확인</span>
                    <div>
                        <Input 
                            type="password"
                            id="password-check"
                            name="password-check"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                        />
                    </div>
                </Label>
                {missmatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                {!nickname && <Error>닉네임을 입력해주세요.</Error>}
                {signUpError && <Error>{signUpError}</Error>}
                {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요?&nbsp;
                <Link to="/login">로그인 하러가기</Link>
                {/* <a href="/login">로그인 하러가기</a> */}
            </LinkContainer>
        </div>
    )
}

export default SignUp;