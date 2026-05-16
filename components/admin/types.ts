export interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    className?: string
}