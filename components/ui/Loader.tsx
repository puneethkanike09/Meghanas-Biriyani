import styles from './Loader.module.css';

interface LoaderProps {
    message?: string;
}

export default function Loader({ message }: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={styles['leap-frog']}>
                <div className={styles['leap-frog__dot']}></div>
                <div className={styles['leap-frog__dot']}></div>
                <div className={styles['leap-frog__dot']}></div>
            </div>
            {message && (
                <p className="text-sm font-medium text-gray-500">{message}</p>
            )}
        </div>
    );
}
