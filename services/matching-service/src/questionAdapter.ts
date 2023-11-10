import http from "http";

export async function getRandomQuestionOfDifficulty(
  difficulty: string
): Promise<string> {
  const requestBody = JSON.stringify({ difficulty });

  const options = {
    hostname: process.env.QUESTION_SERVICE_HOSTNAME || "localhost",
    port: 5004, // Port of the question service
    path: "/api/question-service/random-question",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          const qnId = parsedData[0]._id;
          if (qnId) {
            resolve(qnId);
          } else {
            reject(new Error("Invalid response format"));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(requestBody);
    req.end();
  });
}
