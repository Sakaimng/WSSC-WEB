export type Comedian = {
  id: string;
  name: string;
  role: string;
  bio: string;
};

export const comedians: Comedian[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Host & producer",
    bio: "Keeps the room honest and the punchlines sharp. Ten years of late nights and louder laughs.",
  },
  {
    id: "2",
    name: "Jordan Kim",
    role: "Feature",
    bio: "Observational chaos with heart; tours the West Coast and writes material faster than we can book them.",
  },
  {
    id: "3",
    name: "Sam Okonkwo",
    role: "Headliner",
    bio: "Storytelling with surgical timing—crowd work is optional, destruction of the front row is not.",
  },
  {
    id: "4",
    name: "Riley Torres",
    role: "Regular",
    bio: "Deadpan one-liners and accidental philosophy. The couch in the green room has seen things.",
  },
];
