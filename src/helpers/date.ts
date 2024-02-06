import { format } from "date-fns";

export function formatTimestampDate(data: any) {
  const timestamp =
  data.seconds * 1000 + data.nanoseconds / 1e6;
  const dataJavaScript = new Date(timestamp);
  const dataFormatada = format(dataJavaScript, "dd/MM/yyyy HH:mm:ss");

  return dataFormatada;
}
