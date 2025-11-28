import { cva, type VariantProps } from 'class-variance-authority'
export { default as Toggle } from './Toggle.vue'

export const toggleVariants = cva(
  // BASE
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2',

  {
    variants: {
      variant: {
        default: `
          bg-transparent
          text-black dark:text-white

          hover:bg-gray-100 dark:hover:bg-zinc-700
          hover:text-black dark:hover:text-white
 
          data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-zinc-600
          data-[state=on]:text-black dark:data-[state=on]:text-white
        `,
        outline: `
    border border-muted-foreground/10
    bg-muted
    text-black dark:text-white

    hover:bg-muted-foreground/10
    hover:text-black dark:hover:text-white

     data-[state=off]:bg-transparent

    data-[state=on]:bg-muted-foreground/20
    data-[state=on]:text-black dark:data-[state=on]:text-white
  `,
      },
      size: {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-9 px-2.5 min-w-9',
        lg: 'h-11 px-5 min-w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type ToggleVariants = VariantProps<typeof toggleVariants>
