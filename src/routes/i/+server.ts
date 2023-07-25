import { hexToCSSFilter } from 'hex-to-css-filter';

import { ImageResponse } from '../../lib/og';
import type { RequestHandler } from './$types';

const textColor = '#f47e18';
const templateBgUrl = 'https://senator-countdown.narze.live/images/bg.png';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const color = `#${url.searchParams.get('c') || 'ff7300'}`;
	const text = url.searchParams.get('t') || `${new Date().getMonth() + 1}`;

	const cssFilter = hexToCSSFilter(color);
	const transformedText = text;

	const fontFile = await fetch('/NotoSerifThai-Bold.ttf');
	const fontData: ArrayBuffer = await fontFile.arrayBuffer();

	const template = {
		html: `
      <div tw="flex relative w-full h-full bg-transparent">
        <div tw="flex absolute inset-0 bg-transparent" style="z-index: 30;">
          <img
            src="${templateBgUrl}"
            tw="absolute inset-0"
            style="z-index: 0; filter: ${cssFilter.filter};"
            alt="template"
          />

          <div tw="absolute left-[50%] bottom-[13%] text-[${textColor}] font-bold"
            style="font-size: 100px; z-index: 30; transform: translateX(-50%);
            text-shadow:
            -5px 0px 0 white,
            5px 0px 0 white,
            0px -5px 0 white,
            0px 5px 0 white,
            -3.5px -3.5px 0 white,
            3.5px -3.5px 0 white,
            -3.5px 3.5px 0 white,
            3.5px 3.5px 0 white;">
            ${transformedText}
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
