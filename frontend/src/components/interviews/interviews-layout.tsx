import React from "react";
import { MatchmakingProvider } from "../../providers/MatchmakingProvider";

interface InterviewsLayoutProps {
  children: React.ReactNode;
}

const InterviewsLayout: React.FC<InterviewsLayoutProps> = ({ children }) => {
  return <MatchmakingProvider>{children}</MatchmakingProvider>;
};

export default InterviewsLayout;
