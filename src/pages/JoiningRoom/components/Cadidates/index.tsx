import * as React from "react";
import { useParams } from "react-router-dom";

import { arenaApi as api } from '../../../../lib';

interface Props {
    init: number
}

const Cadidates: React.FC<Props> = ({ init }) => {
    const { id } = useParams<{ id: string }>();
    const [number, setNumber] = React.useState(init);

    const getContest = async (id: number) => {
        try {
            const response = await api.post("/contests/get_contest_round_info/", {
                round_id: id
            });
            if (response.data.c === 1) {
                const data = response.data.d[0]
                setNumber(data.total_candidates)
            }
        } catch (error) {

        }
    }

    React.useEffect(() => {
        const interval: any = setInterval(() => {
            getContest(+id)
        }, 5000)
        return () => clearInterval(interval)
    }, [id])

    return (
        <div className="content__timmer-counter">{number}</div>
    );
};

export default Cadidates;