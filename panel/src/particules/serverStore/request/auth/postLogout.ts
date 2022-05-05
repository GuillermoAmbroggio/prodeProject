import axios from 'axios';

type IPostLogout = () => Promise<string>;

const postLogout: IPostLogout = async () => {
  const { data }: { data: string } = await axios.get('/logout', {
    withCredentials: true,
  });
  return data;
};

export default postLogout;
