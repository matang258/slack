import axios from 'axios';

const fetcher = (url: string) => axios.get(url, {
    withCredentials: true,
})
.then((response) => response.data);
// .then((response) => response.data.length); 로 바꾸면 길이만 저장한다.
//response.data가 useSWR이 리턴하는 값

export default fetcher;