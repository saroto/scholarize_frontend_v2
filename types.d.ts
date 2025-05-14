import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      image: string;
      role: role;
      role_permissions: RolePermissions;
      token: string;
      name: string;
      email: string;
      department: UserDepartment;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: role;
    role_permissions: permission;
    user_color: string;
    token: string;
  }

  type RolePermissions = permission[];
  interface role {
    RoleID: number;
    RoleName: string;
    RoleColor: string;
  }
  declare module "next-auth/jwt" {
    interface JWT {
      role: any;
      role_permissions: any;
      token: any;
    }
  }

  export interface UserDepartment {
    id: number;
    name: string;
    DepartmentTag: string;
    DepartmentColor: string;
    DepartmentStatus: boolean;
    DepartmentName: string;
  }
}

export type permission = {
  permission_category_name: string;
  permissions: string[];
};

interface Department {
  department_id: number;
  department_name: string;
  department_tag: string;
  department_color: string;
  department_status: boolean;
}

interface ResearchType {
  ResearchTypeID: number;
  ResearchTypeName: string;
  ResearchTypeStatus: boolean;
}

interface PaperType {
  research_type_id: number;
  research_type_name: string;
}

//getResearchPapers for display on repository page
export interface ResearchPaper {
  // length: number;
  research_paper_id: number;
  public_id: string;
  research_title: string;
  departments: Department[];
  pdf_path: string;
  fullText: string;
  research_type: ResearchType;
  author: string;
  published_at: string;
  abstract: string;
  user_id: number;
}
interface ViewPaperProps {
  research_paper_id: string; // Assuming it's a string based on router.query
  public_id: string;
}

//searchOptions
export interface SearchOptions {
  search: string;
  sort: ASC | DESC;
  department: number[];
  year: string[];
  research_type: number[];
}

//getDepartment and getPaperType
interface PaperType {
  id: number;
  name: string;
}
interface Department {
  id: number;
  name: string;
}

export interface PaperAndDepartmentResponse {
  paperTypes: PaperType[];
  departments: Department[];
}

interface ResearchPaperSummary {
  research_paper_id: number;
  public_id: string;
  research_title: string;
}

export interface publicResearchPaper {
  awaiting_papers: ResearchPaperSummary[];
  rejected_papers: ResearchPaperSummary[];
  published_papers: ResearchPaper[];
}

interface RawPaper {
  ResearchPaperID: number;
  public_id: string;
  ResearchTypeID: number;
  ResearchTitle: string;
  Abstract: string;
  Tag: string;
  Author: string;
  Advisor: string;
  PDFPath: string;
  ResearchPaperStatus: string;
  FulltextID: number;
  CleantextID: number;
  UserID: number;
  SubmittedAt: string;
  PublishedAt: string;
}

interface Eachpaper {
  fulltext_content: string;
  paper_info: {
    public_id: string;
    research_paper_id: number;
    research_title: string;
    departments: Department[];
    pdf_path: string;
    research_type: ResearchType;
    author: string;
    published_at: string;
    abstract: string;
    user_id: number;
  };
  raw_paper: RawPaper;
}

type GroupMember = {
  id: number;
  profile: string;
  name: string;
  isOwner?: boolean;
  email: string;
};

interface Group {
  id: number;
  name: string;
  isOwner: boolean;
  members: GroupMember[];
  owner: GroupMember;
  actions: string[];
  color?: string;
  collab_archive_status: boolean;
}

export interface GroupsResponse {
  active: Group[];
  archived: Group[];
}

interface Paper {
  research_paper_id: number;
  public_id: string;
  research_title: string;
  departments: Department[];
  pdf_path: string;
  fullText: string;
  research_type: ResearchType;
  author: string;
  published_at: string;
  abstract: string;
  user_id: number;
  // length: number;
}
interface SubmissionPaper {
  department: Department;
  message: string;
  papers: Paper[];
  total_awaiting: number;
  total_rejected: number;
  total_research_papers: number;
}

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_profile_img: string;
  user_status: boolean;
  user_role: UserRole;
}
interface submissionsHodPaper {
  full_text: string;
  paperInfo: RawPaper;
  paper: {
    research_paper_id: number;
    public_id: string;
    research_title: string;
    departments: Department[];
    pdf_path: string;
    research_type: ResearchType;
    author: string;
    published_at: string;
    abstract: string;
    user_id: number;
  };
  user: User;
  path: string | undefined;
}

interface Approve {
  research_paper_id: number;
  public_id: string;
  approval_status: string;
  research_title: string;
  departments: Department[];
  research_type: ResearchType;
  author: string;
  published_at: string;
}

interface ApproveDialogProps {
  approve: Approve;
  open: boolean;
  onClose: () => void;
}
interface Reject {
  research_paper_id: number;
  public_id: string;
  approval_status: string;
  research_title: string;
  departments: Department[];
  research_type: ResearchType;
  author: string;
  published_at: string;
  rejected_reason: string;
}
interface RejectDialogProps {
  reject: Reject;
  open: boolean;
  onClose: () => void;
}
interface awaiting_paper {
  full_text: string;
  paperInfo: RawPaper;
  paper: {
    research_paper_id: number;
    research_title: string;
    departments: Department[];
    pdf_path: string;
    research_type: ResearchType;
    author: string;
    published_at: string;
    abstract: string;
    user_id: number;
  };
  path: string | undefined;
}

interface reject_paper {
  rejected_reason: string;
  full_text: string;
  paperInfo: RawPaper;
  paper: {
    research_paper_id: number;
    research_title: string;
    departments: Department[];
    pdf_path: string;
    research_type: ResearchType;
    author: string;
    published_at: string;
    abstract: string;
    user_id: number;
  };
  path: string | undefined;
}

interface Task {
  task_status_id: string;
  task_status_name: string;
  task_status_color: string;
  task_details: TaskDetail[];
}
interface TaskDetail {
  task_id: string;
  task_title: string;
  task_priority: boolean;
  status_updated_at: string;
  task_assignee: User[];
}

interface TaskData {
  collab_archive_status: "true" | "false";
  collab_name: string;
  tasks: Task[];
}

interface task_assignee {
  task_id: number;
  assignees: User[];
}

interface CollabList {
  active: Collab[];
  archived: Collab[];
}

interface Collab {
  collab_id: string;
  collab_name: string;
  collab_archive_status: boolean;
  owner_info: User;
  members_info: User[] | null;
  actions: string[];
  total_members: number;
}

interface Subtask {
  SubtaskID: string;
  SubtaskTitle: string;
  TaskID: number;
}

interface Subtasks {
  subtasks: Subtask[];
  task_id: number;
}

interface CommentResponse {
  comment: {
    CommentID: number;
    CommentText: string;
    UserID: number;
    CommentAt: string;
  };
  message: string;
}

interface Comment {
  comment_id?: number;
  comment_text: string;
  commented_by: User;
  commented_at: string;
}

interface TaskComments {
  comments: Comment[];
  task_id?: number;
}

interface MemberInfo extends User {}

interface PendingInvite extends User {}

interface Collab {
  collab_id: number;
  collab_name: string;
  collab_archive_status: boolean;
  owner_info: OwnerInfo;
  members_info: MemberInfo[];
  pending_invites: PendingInvite[];
}

interface CollabContainer {
  collab: Collab;
}

interface CollabMember {
  members: User[];
}

interface CollabWithSchedule {
  collab_id: number;
  collab_name: string;
  collab_color: string;
  schedules: Schedule[];
}

interface CurrentEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  collabName: string;
  collabID: string;
  userID: string;
  userName: string;
  repeatGroup: string;
  repeatInterval: string;
}

//permissions member in collab
interface Permissions {
  [key: string]: boolean;
}

interface CollabPermissions {
  collab_id: number;
  permissions: Permissions;
}
