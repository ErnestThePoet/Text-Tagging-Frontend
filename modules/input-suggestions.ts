import axios from "axios";
import taggingData from "../states/tagging-data";
import taskData from "../states/task-data";

// TASK-RELATED
export function fetchInputSuggestions() {
    switch (taskData.taskId) {
        // 文本价值观标注任务
        case 1: {
            task1FetchInputSuggestions(0);
            break;
        }
    }
}

function task1FetchInputSuggestions(currentIndex: number) {
    if (currentIndex >= taggingData.texts.length) {
        return;
    }

    axios.postForm("http://43.138.73.64:12555/lulu", {
        text: taggingData.texts[currentIndex].text
    }).then(res => {
        if (res.data.data?.fine) {
            taggingData.setSingleSuggestion(currentIndex,
                {
                    "3": res.data.data.fine
                        .sort((a, b) => b[1] - a[1])
                        .map(x => ({ value: x[0] }))
                });
        }
    }).finally(() => {
        task1FetchInputSuggestions(currentIndex + 1);
    });
}