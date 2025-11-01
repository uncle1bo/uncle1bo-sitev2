import { useNavigate } from "react-router-dom";
import { userDashBoardPanes } from "../../components/UserDashBoard";
import { useEffect } from "react";

export default function user() {
    const navigate = useNavigate();
    useEffect(() => { navigate(userDashBoardPanes[0].key, { relative: 'path', replace: true }) }, [])
}