import React, { VFC, useCallback, useState } from "react";
import fetcher from '@utils/fetcher';
import axios from "axios";
// import useSWR from 'swr';
import useSWR, { mutate } from 'swr';
import { Redirect, Route, Switch, useParams } from "react-router";
import { AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper } from "./styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import { Link } from "react-router-dom";
import { IChannel, IUser } from '@typings/db';
import { Button, Input, Label } from "@pages/SignUp/style";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import { toast } from 'react-toastify';
import CreateChannelModal from "@components/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal";
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";


const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// const Workspace: FC = ({children}) => {
const Workspace: VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false); //Modal이 아니라 Menu인데 헷갈리게 했네
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

    setShowInviteWorkspaceModal
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { workspace } = useParams<{ workspace: string }>(); //파라미터에서 workspace이름 가져오기[라우터 주소 설계(라우트 파라미터) 10:37]
    const { data: userData, error, mutate } = useSWR<IUser | false>(
        '/api/users', 
        fetcher,
        {
            dedupingInterval: 2000, //2초
        }
    );
    const { data: channelData } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null, fetcher
    );
    
    const onLogout = useCallback(() => {
        axios.post('/api/users/logout', null, {
            withCredentials: true, //쿠키를 백엔드와 프론트가 서로 공유하려면 필요
        })
        .then(() => {
            mutate(false, false);  //[swr 활용법(optimistic ui)] 10:56
            // mutate('http://localhost:3095/api/users', false); //import useSWR, { mutate } from 'swr';로 선언해서 범용적으로 사용할 수 있는 mutate
        })
    }, []);

    const onClickUserProfile = useCallback(() => {
        // setShowUserMenu((prev) => !prev);
        // console.log('hi');
        // console.trace('hi')
        setShowUserMenu((prev) => {
            console.log("Previous value of showUserMenu: ", prev);
            return !prev
        });
    }, []);

    const onCloseUseProfile = useCallback((e) => {
        // console.log('close');
        e.stopPropagation();
        setShowUserMenu(false);
    },[]);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    const onCloseModal = useCallback(() => { //onCloseModal은 화면에 떠있는 모달을 전부 닫는 메소드
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    }, []);

    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal((prev) => !prev)
    }, []);

    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    },[]);


    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if(!newWorkspace || !newWorkspace.trim()) return;
        if(!newUrl || !newUrl.trim()) return;  //<--newUrl앞에 !빼먹었더니 그냥 return해버려서 에러도 안나고 찾는데 시간걸림

        console.log("워크스프페이스 생성");
        console.log("newWorkspace",newWorkspace);
        console.log("newUrl",newUrl);
        axios.post( '/api/workspaces', {
            workspace: newWorkspace,  //이부분 Workspace로 앞글자 대문자로 오타냈더니{"success":false,"code":400,"data":["workspace should not be empty","workspace must be a string"],"etc":"기타"} 400번 에러남
            url: newUrl,
        },{
            withCredentials: true,
        })
        .then(() => {
            mutate();
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        })
        .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, {position: 'bottom-center'});
        })
    }, [newWorkspace, newUrl]);

    const onClickInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true);
    }, []);


    // console.log("work", workspace);

    // if(userData == undefined) {
    // if(userData === false) {
    if(!userData) {
        return <Redirect to="/login" />
    }

    return (
        <div>
            <Header>
                {userData && (
                    <RightMenu>
                        <span onClick={onClickUserProfile}>
                            <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d:'retro'})} alt={userData.nickname}/>
                            {/* {showUserMenu && <Menu>프로필 메뉴</Menu>} */}
                            {showUserMenu && (
                                // <Menu style={{ right: 0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                                // <Menu style={{ right: 0, top: 38, backgroundColor: 'skyblue'}} show={showUserMenu} onCloseModal={onCloseUseProfile}>
                                <Menu style={{ right: 0, top: 38}} show={showUserMenu} onCloseModal={onCloseUseProfile}>
                                    {/* 프로필 메뉴 */}
                                    <ProfileModal>
                                        <img src={gravatar.url(userData.nickname, {s: '36px', d:'retro'})} alt={userData.nickname} />
                                        <div>
                                            <span id="profile-name">{userData.nickname}</span>
                                            <span id="profile-active">Active</span>
                                        </div>
                                    </ProfileModal>
                                    <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                                </Menu>
                            )}
                        </span>
                    </RightMenu>
                )}
                test
            </Header>
            {/* <button onClick={onLogout}>로그아웃</button> */}
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces?.map((ws) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80}}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                                <button onClick={onClickAddChannel}>채널 만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>
                        {/* <ChannelList userData={userData} /> */}
                        {/* <DMList userData={userData} /> */}
                        <ChannelList />
                        <DMList />
                        {/* <div>워크스페이스:{workspace}</div>
                        {channelData?.map((v) => (<div>{v.name}</div>))} */}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
                        <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
                    </Switch>
                </Chats>
                {/* <Chats>Chats</Chats> */}
                {/* {children} */}
            </WorkspaceWrapper>
            {/* 워크스페이스 생성 모달(+누르면 뜸) */}
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}> {/* onCloseModal대신 onClickCreateWorkspace를 넣고 onClickUserProfile처럼 토글 해도 되는 거 아닌가 */}
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspase" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <Input id="workspase" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
            {/* 채널생성모달 */}
            <CreateChannelModal 
                show={showCreateChannelModal}
                onCloseModal={onCloseModal} 
                setShowCreateChannelModal={setShowCreateChannelModal} />
            <InviteWorkspaceModal 
                show={showInviteWorkspaceModal} 
                onCloseModal={onCloseModal} 
                setShowInviteWorkspaceModal={setShowInviteWorkspaceModal} />
            <InviteChannelModal 
                show={showInviteChannelModal} 
                onCloseModal={onCloseModal} 
                setShowInviteChannelModal={setShowInviteChannelModal} />
        </div>
    )
}
Menu.defaultProps = {
	closeButton: true,
}


export default Workspace;