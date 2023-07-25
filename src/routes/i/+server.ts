import { ImageResponse } from '../../lib/og';
import type { RequestHandler } from './$types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const textColor = '#f47e18';
const templateBgUrl = 'https://senator-countdown.vercel.app/images/bg.png';

export const GET: RequestHandler = async ({ fetch }) => {
	const targetDate = dayjs('2024-05-11');
	const currentDate = dayjs();
	const timeDifference = targetDate.diff(currentDate);
	const countdown = dayjs.duration(timeDifference);
	const text = String(Math.ceil(countdown.asDays()));

	const fontFile = await fetch('/NotoSerifThai-Bold.ttf');
	const fontData: ArrayBuffer = await fontFile.arrayBuffer();

	const template = {
		html: `
      <div tw="flex relative w-full h-full bg-transparent">
        <div tw="flex absolute inset-0 bg-transparent" style="z-index: 30;">
          <img
            src="${templateBgUrl}"
            tw="absolute inset-0"
            style="z-index: 0;"
            alt="template"
          />

          <div tw="absolute left-[58%] top-[32%] text-end text-[${textColor}] font-bold"
            style="font-size: 250px; z-index: 30; transform: translateX(-50%);
            text-shadow:
            -10px 0px 0 black,
            10px 0px 0 black,
            0px -10px 0 black,
            0px 10px 0 black,
            -7px -7px 0 black,
            7px -7px 0 black,
            -7px 7px 0 black,
            7px 7px 0 black;">
            ${text}
          </div>
        </div>
      </div>`
	};

	return await ImageResponse(template.html, {
		height: 1080,
		width: 1080,
		fonts: [
			{
				name: 'Noto Serif Thai',
				data: fontData,
				weight: 700
			}
		]
	});
};
