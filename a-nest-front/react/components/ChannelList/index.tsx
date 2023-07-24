import { CollapseButton } from '@components/DMList/styles';
import EachChannel from '@components/EachChannel';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useSWR from 'swr';

interface Props {
    channelData?: IChannel[];
    userData?: IUser;
}

// const ChannelList: FC<Props> = ({ userData, channelData }) => {  //swr사용해서 프롭스로 받아올 필요 없음
const ChannelList: FC = () => {
    const { workspace } = useParams<{ workspace?: string }>();
    const location = useLocation();
    // const [socket] = useSocket(workspace);
    const [channelCollapse, setChannelCollapse] = useState(false);
    const [countList, setCountList] = useState<{ [key: string ]: number | undefined }>({});

    //userData, channelData는 Props가 아닌 swr에서 가져오면 됨
    const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
      dedupingInterval: 2000, // 2초
    }); //<IUser | false> 였던거 false지움
    const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

    const toggleChannelCollapse = useCallback(() => {
        setChannelCollapse((prev) => !prev);
      }, []);
    
    return (
        <>
          <h2>
            <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
              <i
                className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                data-qa="channel-section-collapse"
                aria-hidden="true"
              />
            </CollapseButton>
            <span>Channels</span>
          </h2>
          <div>
            {!channelCollapse &&
              channelData?.map((channel) => {
                return <EachChannel key={channel.id} channel={channel} />;
              })}
          </div>
        </>
      );
    };
    
export default ChannelList;