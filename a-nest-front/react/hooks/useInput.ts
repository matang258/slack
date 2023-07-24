import { Dispatch, SetStateAction, useCallback, useState, UIEvent } from "react";


type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>]
// const useInput = (initialData: any) => {
// const useInput = <T = any>(initialData: T): [T, (e: UIEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] => {  //UIEvent는 틀린코드이고 강의에서 해봤다가 나중에 알려준다고 하고 마지막에 자막으로 ChangeEvent<HTMLInputElement>로 수정하라고 나옴
const useInput = <T = any>(initialData: T): ReturnTypes<T> => { //(근데 여기서 : ReturnTypes로 <T> 빼도 에러 안나는데 이유가 뭔지 궁금
    
    const [value, setValue] = useState(initialData);
    // const handler = useCallback((e: UIEvent<HTMLInputElement>) => {  //UIEvent는 틀린코드이고 강의에서 해봤다가 나중에 알려준다고 하고 마지막에 자막으로 ChangeEvent<HTMLInputElement>로 수정하라고 나옴
    const handler = useCallback((e) => {
        setValue(e.target.value);
    }, []);
    return [value, handler, setValue];
};

export default useInput;