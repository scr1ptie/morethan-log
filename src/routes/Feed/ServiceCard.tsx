import { CONFIG } from "site.config"
import React from "react"
import { AiFillCodeSandboxCircle, AiOutlineFilePdf, AiOutlineGithub } from "react-icons/ai"
import { SiLeetcode } from "react-icons/si"
import styled from "@emotion/styled"
import { Emoji } from "src/components/Emoji"

const ServiceCard: React.FC = () => {
  if (!CONFIG.projects) return null
  return (
    <>
      <StyledTitle>
        <Emoji>🔮</Emoji> Platforms
      </StyledTitle>
      <StyledWrapper>
        {CONFIG.profile.resume && (
          <a
            href={`${CONFIG.profile.url}${CONFIG.profile.resume}`}
            rel="noreferrer"
          >
            <AiOutlineFilePdf className="icon" />
            <div className="name">My Resume</div>
          </a>
        )}
        {CONFIG.profile.github && (
          <a
            href={`https://github.com/${CONFIG.profile.github}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiOutlineGithub className="icon" />
            <div className="name">My Github</div>
          </a>
        )}
        {CONFIG.profile.leetcode && (
          <a
            href={`${CONFIG.profile.leetcode}`}
            rel="noreferrer"
          >
            <SiLeetcode className="icon" />
            <div className="name">LeetCode Profile</div>
          </a>
        )}
        {CONFIG.projects.map((project, idx) => (
          <a
            key={idx}
            href={`${profile.site}/HTB-Academy-Transcript.pdf`}
            rel="noreferrer"
          >
            <AiFillCodeSandboxCircle className="icon" />
            <div className="name">HTB Academy Transcript</div>
          </a>
        ))}
      </StyledWrapper>
    </>
  )
}

export default ServiceCard

const StyledTitle = styled.div`
  padding: 0.25rem;
  margin-bottom: 0.75rem;
`

const StyledWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
  margin-bottom: 2.25rem;
  flex-direction: column;
  border-radius: 1rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  > a {
    display: flex;
    padding: 0.75rem;
    gap: 0.75rem;
    align-items: center;
    border-radius: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray5};
    }
    .icon {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .name {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
`
