import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/style';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (falg: boolean) => void;
}
const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal }) => {
    const [newChannel, onChangeNewChannel, setNewChannel ] = useInput('');
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
    const { data: userData, error, mutate } = useSWR<IUser | false>(
        '/api/users', fetcher
    );
    const { data: channelData, mutate: revalidateChannel } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null, fetcher
    );


    const onCreateChannel = useCallback((e) => {
        e.preventDefault();
        console.log(newChannel);
        axios.post(`/api/workspaces/${workspace}/channels`, {
                name: newChannel,
            }, {
                withCredentials:true,
            }
        ).then(() => {
            setShowCreateChannelModal(false);
            revalidateChannel();
            setNewChannel('');
        }).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, {position: 'bottom-center'});
        })
    }, [newChannel]);

    // if(!show) return null 넣을 필요가 없음.
    // 왜냐하면 여기서 내부적으로 또 <Modal show={show} onCloseModal={onCloseModal}>를 사용하기 때문

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id="workspase" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>

    )
}

export default CreateChannelModal;