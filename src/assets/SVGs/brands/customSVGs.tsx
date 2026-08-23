import React, { createElement } from 'react';

// Play Icon
export const PlayIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Chevron Left
export const ChevronLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

// Chevron Right
export const ChevronRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Chevron Down
export const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Chevron Down (Blue stroke for CreatorSummary)
export const ChevronDownBlueIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 9l4 4 4-4" stroke="#1D4ED8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Edit/Pencil Icon
export const EditIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

// Campaign Icon (briefcase/portfolio)
export const CampaignIcon = ({ className = "w-6 h-6", fill = "#1E60DB" }: { className?: string; fill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.25 5.25H16.5V4.5C16.5 3.90326 16.2629 3.33097 15.841 2.90901C15.419 2.48705 14.8467 2.25 14.25 2.25H9.75C9.15326 2.25 8.58097 2.48705 8.15901 2.90901C7.73705 3.33097 7.5 3.90326 7.5 4.5V5.25H3.75C3.35218 5.25 2.97064 5.40804 2.68934 5.68934C2.40804 5.97064 2.25 6.35218 2.25 6.75V18.75C2.25 19.1478 2.40804 19.5294 2.68934 19.8107C2.97064 20.092 3.35218 20.25 3.75 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V6.75C21.75 6.35218 21.592 5.97064 21.3107 5.68934C21.0294 5.40804 20.6478 5.25 20.25 5.25ZM9 4.5C9 4.30109 9.07902 4.11032 9.21967 3.96967C9.36032 3.82902 9.55109 3.75 9.75 3.75H14.25C14.4489 3.75 14.6397 3.82902 14.7803 3.96967C14.921 4.11032 15 4.30109 15 4.5V5.25H9V4.5ZM20.25 6.75V10.6509C17.7185 12.0289 14.8822 12.7505 12 12.75C9.11794 12.7505 6.28165 12.0292 3.75 10.6519V6.75H20.25ZM20.25 18.75H3.75V12.3412C6.31868 13.5977 9.1405 14.2506 12 14.25C14.8596 14.2501 17.6813 13.5969 20.25 12.3403V18.75ZM9.75 10.5C9.75 10.3011 9.82902 10.1103 9.96967 9.96967C10.1103 9.82902 10.3011 9.75 10.5 9.75H13.5C13.6989 9.75 13.8897 9.82902 14.0303 9.96967C14.171 10.1103 14.25 10.3011 14.25 10.5C14.25 10.6989 14.171 10.8897 14.0303 11.0303C13.8897 11.171 13.6989 11.25 13.5 11.25H10.5C10.3011 11.25 10.1103 11.171 9.96967 11.0303C9.82902 10.8897 9.75 10.6989 9.75 10.5Z" fill={fill}/>
  </svg>
);

// Image/Photo Icon
export const PhotoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2"/>
  </svg>
);

// Pagination Arrow Left
export const PaginationLeftIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 9L1 5L5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Pagination Arrow Right
export const PaginationRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Custom Cash Icon (used in Campaign Summary)
export const CashIcon = (props: any) =>
  createElement(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
    },
    createElement("path", {
      d: "M13.334 4H2.66732C1.93094 4 1.33398 4.59695 1.33398 5.33333V10.6667C1.33398 11.403 1.93094 12 2.66732 12H13.334C14.0704 12 14.6673 11.403 14.6673 10.6667V5.33333C14.6673 4.59695 14.0704 4 13.334 4Z",
      stroke: "currentColor",
      strokeWidth: "1.33333",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    createElement("path", {
      d: "M7.99935 9.33366C8.73573 9.33366 9.33268 8.73671 9.33268 8.00033C9.33268 7.26395 8.73573 6.66699 7.99935 6.66699C7.26297 6.66699 6.66602 7.26395 6.66602 8.00033C6.66602 8.73671 7.26297 9.33366 7.99935 9.33366Z",
      stroke: "currentColor",
      strokeWidth: "1.33333",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    createElement("path", {
      d: "M4 8H4.00667M12 8H12.0067",
      stroke: "currentColor",
      strokeWidth: "1.33333",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
