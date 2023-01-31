export default function IndexPage({apiKey} : {apiKey: string}) {
  // Set the request parameters
  const params = {
    model: 'text-davinci-002',
    prompt: `Please generate a weekly training plan for a runner who is preparing for a ${targetRace} race with an experience level of ${experience} and an age of ${age}. That normally runs about ${normalMilage} miles per week and I like to include ${workouts} in my training. The total milage should not be more then 20% off of ${normalMilage} The training plan should be a list of days Monday-Sunday that include a mix of easy and faster-paced runs, and to specify the type of run for each day. When a workout is included, please specify the workout in the following format: "Monday: track workout: 4x400 race pace: 1" (1 represents the miles, make sure to include total milage including warmup and cooldown) but when it isn't a workout (this includes long runs) please have it in the following format “Monday: 11 miles easy”. ${savedDays ? ("The plan already includes: " + savedDays.map((savedDay) => savedDay.day.originalText).join('\n')) : ''}`,
    max_tokens: 2048,
};

// Make the request
const response = await axios.post('https://api.openai.com/v1/completions', params, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    },
});
  return <h1>IndexPage</h1>;
}
export function getStaticProps() {
  return {
    props: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  };
}
