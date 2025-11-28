import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-gray-950 focus-visible:ring-gray-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-gray-300 dark:focus-visible:ring-gray-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900',
  {
    variants: {
      variant: {
        default:
          'bg-gray-900 text-gray-50 shadow-xs hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90',
        destructive:
          'bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60 dark:bg-red-900 dark:hover:bg-red-900/90 dark:focus-visible:ring-red-900/20 dark:dark:focus-visible:ring-red-900/40 dark:dark:bg-red-900/60',
        outline:
          'border bg-white shadow-xs hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-200/30 dark:border-gray-200 dark:hover:bg-gray-200/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:dark:bg-gray-800/30 dark:dark:border-gray-800 dark:dark:hover:bg-gray-800/50',
        secondary:
          'bg-gray-100 text-gray-900 shadow-xs hover:bg-gray-100/80 dark:bg-border dark:text-gray-50 dark:hover:bg-border/80',
        ghost:
          'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-100/50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:dark:hover:bg-gray-800/50',
        link: 'text-gray-900 underline-offset-4 hover:underline dark:text-gray-50',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
