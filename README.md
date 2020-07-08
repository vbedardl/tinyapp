# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Basic Features
  -Some additional data were added to the initial project:
    -The creation date of all links is available to see
    -The number of time the tinyURL was clicked
    -The number of unique visitors that cliqued on the tinyURL

## PRO Account Features
- For a more complete experience, you can create a "Paid account" when you register. Paid accounts have access to some extra features:
  -Being able to customize their tinyURL (6 character max) if they want to
  -Having a handy Copy to clipboard snippet that allows to copy/paste the new link
  -Having access to a Analytics Tab 
    -The analytics tab display a pie chart that gives data about the ratio mobile clicks vs desktop clicks for the entire account. For a more granular look, you can select the dropdown for a particular url. You then have access to:
        - A pie chart with the mobile/desktop click ratio
        - A table indicating the referral sources where the clicks were made. For example; If you post your link on Facebook and on a blog, you will see the traffic that came from Facebook, and the traffic that came from the blog post. (This functionnality is limited to the third party website. With the CORS policy, some websites do not allow the transert of the referral information, some do.)