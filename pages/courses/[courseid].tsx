import { useRouter } from "next/router";

const Course = () => {
    const router = useRouter();
    const { courseid } = router.query;

    return <h1>Course: {courseid}</h1>;
};
