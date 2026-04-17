import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
//cn = безпечне склеювання Tailwind-класів з підтримкою умовних виразів і автоматичним вирішенням конфліктів. Це маленька, але обов'язкова "тканина", що з'єднує всі компоненти shadcn/ui
