import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from "./styles";


interface Props {
    show: boolean;
    onCloseModal: (e: any) => void;
    style: CSSProperties;
    closeButton?: boolean;
}
const Menu: FC<Props> = ({children, style, show, onCloseModal, closeButton}) => {

    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, []);

    
    if(!show) return null;  //특이한건 Workspace에서 처음에 Menu만든 showUserMenu는 이거 사용하지 않고 그냥 {showUserMenu && (<Menu>)}로 보였다 닫았다 함

    return (
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation} >
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>
    )
}
Menu.defaultProps = { //props의 기본값을 설정
    closeButton: false, //이렇게 설정해놓으면 Menu Component를 쓰는쪽(Workspace/index.tsx)에서 closeButton속성을 넣어주지 않아도 closeButton: true로 잡혀있다.
}
/* Menu.propTypes = {
    
} */

export default Menu;