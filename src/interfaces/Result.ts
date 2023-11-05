import ResultType from "../enums/ResultType.ts";
import ResultStatus from "../enums/ResultStatus.ts";

interface Result<D> {
    status: ResultStatus,
    type: ResultType,
    message: string,
    data: D
}
export default Result