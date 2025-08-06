export interface ConfigFileListProps {
  path: string;
  branch: string;
  sha: string;
  encoding: string;
  downloadUrl: string;
  textContent: string;
  lastCommitterDate: string;
  type: string;
  last_commit_sha: string;
  name: string;
}

export interface ConfigFileInfoProps {
  path: string;
  branch: string;
  sha: string;
  encoding: string;
  downloadUrl: string;
  textContent: string;
  lastCommitterDate: string;
  type: string;
  last_commit_sha: string;
  name: string;
}

export interface BranchListProps {
  name: string;
  sha: string;
  protected: true;
}

export interface OriginFileDetailProps {
  path: string;
  branch: string;
  sha: string;
  encoding: string;
  downloadUrl: string;
  textContent: string;
  lastCommitterDate: string;
  type: string;
  last_commit_sha: string;
  name: string;
}

export interface CreateUploadFileProps {
  path: string;
  branch: string;
  sha: string;
  encoding: string;
  downloadUrl: string;
  textContent: string;
  lastCommitterDate: string;
  type: string;
  last_commit_sha: string;
  name: string;
}

export interface FileCommitListProps {
  sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  commitTime: string;
}

export interface FileCommitDetailProps {}
