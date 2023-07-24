import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/style';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { stringify } from 'querystring';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: FC<Props> = ({show, onCloseModal, setShowInviteChannelModal }) => {
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
    console.log("워크스페이스=",workspace);
    console.log("채널=",channel);
    const [ newMember, onChangeNewMember, setNewMember ] = useInput('');

    const { data: userData } = useSWR<IUser>('/api/users', fetcher);
    const { mutate: revalidateMembers } = useSWR<IUser[]>(
        userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher,
    );
    
    const onInviteMember = useCallback(
        (e) => {
            e.preventDefault();
            if(!newMember || !newMember.trim()) {
                return;
            }
            
            // alert("onInviteMember");
            // axios.post(`/api/workspace/${workspace}/members`, {
            axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
                email: newMember,
            })
            .then(() => {
                revalidateMembers();
                setShowInviteChannelModal(false);
                setNewMember('');
            })
            .catch((error) => {
                console.dir(error);
                toast.error(error.response?.data, { position: 'bottom-center' });
            })
        },
        [newMember, workspace, revalidateMembers, setShowInviteChannelModal, setNewMember]
    )


    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onInviteMember}>
                <Label id="member-label">
                    <span>채널 멤버 초대</span>
                    <Input id="member" type="email" value={newMember} onChange={onChangeNewMember}/>
                </Label>
                <Button type="submit">초대하기</Button>
            </form>
        </Modal>
    );
};

export default InviteChannelModal;