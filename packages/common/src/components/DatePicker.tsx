import type { Moment } from "moment";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import generatePicker from "antd/es/date-picker/generatePicker";

export const DatePicker = generatePicker<Moment>(momentGenerateConfig);
