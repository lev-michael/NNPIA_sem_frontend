import { Progress } from 'react-sweet-progress';
import "./ProgressCircle.scss"

function ProgressCircle({ score }) {

    const getStatus = (score) => {
        if (!score)
            return "default";
        if (score < 35)
            return "error";
        if (score < 69)
            return "active";

        return "success"
    }

    return <Progress percent={Math.round(score * 10)} status={getStatus(score * 10)} type="circle"
        strokeWidth={5} width={30} symbolClassName="symbol"
        theme={
            {
                default: {
                    trailColor: 'black',
                    color: 'gray',
                    symbol: `-`
                },
                error: {
                    trailColor: 'black',
                    color: 'red',
                    symbol: `${Math.round(score * 10)}%`
                },
                active: {
                    trailColor: 'black',
                    color: 'yellow',
                    symbol: `${Math.round(score * 10)}%`
                },
                success: {
                    trailColor: 'black',
                    color: 'green',
                    symbol: `${Math.round(score * 10)}%`
                }
            }
        }
    />
}

export default ProgressCircle;