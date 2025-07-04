import { forwardRef, HtmlHTMLAttributes } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { Feedback, FeedbackType } from "../services/studentService";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type SessionItemChartExtraProps = {
  feedbacks: Feedback[];
}

export const SessionItemChart = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement> & SessionItemChartExtraProps>(
  ({ feedbacks }) => {
    const data: ({ seqnum: number } & Feedback)[] = []
    for (let i = 0; i < feedbacks.length; i++) {
      data.push({
        ...feedbacks[i],
        seqnum: i + 1
      })
    }
    return (
      <div className="w-[70%]">
        {
          feedbacks.length === 0 ? (
            <h2 className="text-xl relative top-[50%] text-slate-600 dark:text-slate-400">There were no feedbacks in this session. Is there something wrong?</h2>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <LineChart height={500} width={600} data={data} >
                <XAxis dataKey="seqnum" />
                <YAxis type="category" domain={[FeedbackType.DISTRACTED, FeedbackType.NORMAL, FeedbackType.FOCUSED]} width={100} />
                <Line type="monotone" dataKey="output" />
                <Tooltip content={LineChartTooltip} />
              </LineChart>
            </ResponsiveContainer>
          )
        }
      </div>
    )
  }
);

function LineChartTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    const v = payload[0].value?.toString();
    if (!v) {
      throw Error('Something is wrong with the library')
    }
    return (
      <div className={`
        p-2 rounded-md
        bg-slate-300 dark:bg-slate-700
        text-slate-700 dark:text-slate-300 opacity-70
      `}>
        <p>Minute {label}: {v?.charAt(0).toUpperCase() + v?.slice(1)}</p>
      </div>
    )
  }
}