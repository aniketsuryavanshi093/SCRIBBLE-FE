import { useContext } from 'react'
import SocketContext from '../Contexts/SocketContext';
import { ScoketHookType } from '../types/socketType';

const useSockets = () => {
    return useContext(SocketContext) as ScoketHookType;
}

export default useSockets