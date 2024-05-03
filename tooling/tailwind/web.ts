import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

import base from "./base";

export default {
	content: base.content,
	presets: [base],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				slate: {
					1: "var(--slate-1)",
					2: "var(--slate-2)",
					3: "var(--slate-3)",
					4: "var(--slate-4)",
					5: "var(--slate-5)",
					6: "var(--slate-6)",
					7: "var(--slate-7)",
					8: "var(--slate-8)",
					9: "var(--slate-9)",
					10: "var(--slate-10)",
					11: "var(--slate-11)",
					12: "var(--slate-12)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [animate],
} satisfies Config;
