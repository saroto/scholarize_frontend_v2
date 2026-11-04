const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function buildDump(referenceDate) {
  assert.match(referenceDate, /^\d{4}-\d{2}-\d{2}$/);
  const base = Date.parse(`${referenceDate}T00:00:00Z`);
  assert.ok(Number.isFinite(base), "Invalid reference date");
  assert.equal(new Date(base).toISOString().slice(0, 10), referenceDate);
  const at = (days, hour = 2, minute = 0) =>
    new Date(base + days * 86400000 + hour * 3600000 + minute * 60000).toISOString();

  const roles = [
    { RoleID: 1, RoleName: "Student", RoleColor: "#2563eb" },
    { RoleID: 2, RoleName: "Lecturer", RoleColor: "#059669" },
    { RoleID: 3, RoleName: "Head of Department", RoleColor: "#9333ea" },
  ];
  const departments = [
    [1, "Computer Science", "CS", "#2563eb"],
    [2, "Information Technology", "IT", "#059669"],
    [3, "Business Administration", "BA", "#d97706"],
    [4, "Environmental Science", "ES", "#9333ea"],
  ].map(([DepartmentID, DepartmentName, DepartmentTag, DepartmentColor]) => ({
    DepartmentID, DepartmentName, DepartmentTag, DepartmentColor, DepartmentStatus: true,
  }));
  const researchTypes = ["Thesis", "Research Paper", "Project Report"].map((name, i) => ({
    ResearchTypeID: i + 1, ResearchTypeName: name, ResearchTypeStatus: true,
  }));
  const users = [
    [1, "Sok Dara", "dara", 1, 1],
    [2, "Chan Sopheak", "sopheak", 1, 1],
    [3, "Meas Lina", "lina", 2, 2],
    [4, "Keo Vanna", "vanna", 3, 1],
    [5, "Lim Bopha", "bopha", 1, 3],
    [6, "Heng Rith", "rith", 2, 4],
    [7, "Nim Sreypov", "sreypov", 1, 2],
    [8, "Test Inactive User", "inactive", 1, 4],
  ].map(([id, name, email, roleId, departmentId]) => ({
    user_id: id, user_name: name, user_email: `${email}@example.test`,
    user_profile_img: "", user_status: id !== 8,
    user_role: roles.find((role) => role.RoleID === roleId), department_id: departmentId,
  }));
  const userById = (id) => {
    const { department_id, ...user } = users.find((item) => item.user_id === id);
    return user;
  };
  const departmentView = (id) => {
    const department = departments.find((item) => item.DepartmentID === id);
    return {
      id, name: department.DepartmentName, department_id: id,
      department_name: department.DepartmentName, department_tag: department.DepartmentTag,
      department_color: department.DepartmentColor, department_status: department.DepartmentStatus,
    };
  };
  const paperSpecs = [
    ["Semantic Search for Khmer Academic Publications", 1, [1, 2], 1, "published"],
    ["A Mobile Learning Platform for Rural Schools", 1, [1, 2], 3, "published"],
    ["Urban Flood Forecasting with Open Sensor Data", 6, [4, 1], 2, "published"],
    ["Digital Payments and Small Business Adoption", 5, [3], 2, "published"],
    ["Privacy-Aware Student Attendance Analytics", 3, [2], 1, "published"],
    ["Evaluating Campus Solar Energy Potential", 6, [4], 3, "published"],
    ["Accessible Research Repositories for Multilingual Users", 2, [1], 2, "published"],
    ["Offline-First Library Catalogues", 7, [2], 3, "published"],
    ["Collaboration Tools for Undergraduate Research", 1, [1], 1, "awaiting"],
    ["Khmer Text Classification with Small Language Models", 2, [1, 2], 2, "awaiting"],
    ["Waste Sorting Behaviour on University Campuses", 6, [4], 2, "awaiting"],
    ["Measuring E-Commerce Readiness in Student Businesses", 5, [3], 3, "awaiting"],
    ["A Pilot Study of Automated Literature Reviews", 1, [1], 2, "rejected"],
    ["Student Connectivity and Digital Inclusion", 7, [2, 3], 1, "rejected"],
    ["An Initial Review of Water Quality Sampling", 6, [4], 3, "rejected"],
    ["A Draft Framework for Sustainable Campus Transport", 6, [4, 3], 2, "unpublished"],
  ];
  const papers = paperSpecs.map(([title, owner, departmentIds, typeId, status], i) => ({
    research_paper_id: 101 + i, public_id: `test-paper-${String(i + 1).padStart(3, "0")}`,
    research_title: title, department_ids: departmentIds, research_type_id: typeId,
    user_id: owner, author: userById(owner).user_name,
    abstract: `This synthetic study, ${title}, evaluates a practical research question using a reproducible pilot dataset. It compares baseline methods, records limitations, and outlines recommendations for a larger study.`,
    fullText: `# ${title}\n\n## Introduction\nThis is fictional test content for Scholarize.\n\n## Method\nA synthetic pilot dataset is used to compare two baseline approaches.\n\n## Results\nThe sample highlights usability, reproducibility, and data quality.\n\n## Limitations\nThese statements are testing examples, not actual research findings.`,
    pdf_path: `fixtures/papers/test-paper-${String(i + 1).padStart(3, "0")}.pdf`,
    advisor: i % 3 === 0 ? "None" : "Dr. Test Advisor",
    tags: ["synthetic", departments[departmentIds[0] - 1].DepartmentTag.toLowerCase(), "research"],
    status, submitted_at: at(-60 + i),
    published_at: status === "published" ? at(-40 + i * 3) : null,
    rejected_reason: status === "rejected" ? "Please clarify the methodology, add missing citations, and resubmit the revised paper." : null,
  }));
  const paperView = (paper) => ({
    research_paper_id: paper.research_paper_id, public_id: paper.public_id,
    research_title: paper.research_title, departments: paper.department_ids.map(departmentView),
    pdf_path: paper.pdf_path, fullText: paper.fullText,
    research_type: researchTypes.find((type) => type.ResearchTypeID === paper.research_type_id),
    author: paper.author, published_at: paper.published_at || "", abstract: paper.abstract,
    user_id: paper.user_id,
  });
  const rawPaper = (paper) => ({
    ResearchPaperID: paper.research_paper_id, public_id: paper.public_id,
    ResearchTypeID: paper.research_type_id, ResearchTitle: paper.research_title,
    Abstract: paper.abstract, Tag: paper.tags.join(", "), Author: paper.author,
    Advisor: paper.advisor, PDFPath: paper.pdf_path, ResearchPaperStatus: paper.status,
    FulltextID: paper.research_paper_id + 1000, CleantextID: paper.research_paper_id + 2000,
    UserID: paper.user_id, SubmittedAt: paper.submitted_at, PublishedAt: paper.published_at || "",
  });
  const paperDetail = (paper) => ({
    fulltext_content: paper.fullText, paper_info: paperView(paper), raw_paper: rawPaper(paper),
  });
  const reviewDetail = (paper) => ({
    full_text: paper.fullText, paperInfo: rawPaper(paper), paper: paperView(paper),
    user: userById(paper.user_id), path: paper.pdf_path,
    ...(paper.rejected_reason ? { rejected_reason: paper.rejected_reason } : {}),
  });

  const collaborations = [
    { collab_id: 201, collab_name: "Khmer Search Lab", collab_color: "#2563eb", collab_archive_status: false, owner_id: 1, member_ids: [1, 2, 3, 4], pending_invite_ids: [7] },
    { collab_id: 202, collab_name: "Green Campus Study", collab_color: "#059669", collab_archive_status: false, owner_id: 6, member_ids: [6, 1, 5], pending_invite_ids: [] },
    { collab_id: 203, collab_name: "Archived Library Pilot", collab_color: "#64748b", collab_archive_status: true, owner_id: 3, member_ids: [3, 1, 7], pending_invite_ids: [] },
  ];
  const collabView = (collab) => ({
    collab_id: collab.collab_id, collab_name: collab.collab_name,
    collab_color: collab.collab_color, collab_archive_status: collab.collab_archive_status,
    owner_info: userById(collab.owner_id), members_info: collab.member_ids.map(userById),
    pending_invites: collab.pending_invite_ids.map(userById), total_members: collab.member_ids.length,
    actions: collab.owner_id === 1 ? ["Edit", "Archive", "Delete", "Permissions"] : ["Leave"],
  });
  const taskStatuses = [
    { task_status_id: "1", task_status_name: "To do", task_status_color: "#64748b" },
    { task_status_id: "2", task_status_name: "In progress", task_status_color: "#2563eb" },
    { task_status_id: "3", task_status_name: "In review", task_status_color: "#d97706" },
    { task_status_id: "4", task_status_name: "Done", task_status_color: "#059669" },
  ];
  const taskTitles = ["Collect related literature", "Clean the pilot dataset", "Review the experiment plan", "Prepare the baseline report", "Run evaluation interviews", "Document the findings"];
  const tasks = collaborations.flatMap((collab, groupIndex) => taskTitles.map((title, i) => ({
    task_id: 301 + groupIndex * taskTitles.length + i, collab_id: collab.collab_id,
    task_title: title, task_status_id: String(collab.collab_archive_status ? 4 : i % 4 + 1),
    task_priority: i % 3 === 0, status_updated_at: at(-7 + i),
    assignee_ids: i === 0 ? [] : [collab.member_ids[i % collab.member_ids.length]],
  })));
  const subtasks = tasks.flatMap((task, i) => [0, 1].map((part) => ({
    SubtaskID: String(401 + i * 2 + part), SubtaskTitle: part === 0 ? "Prepare source material" : "Record review notes", TaskID: task.task_id,
  })));
  const comments = tasks.filter((_, i) => i % 2 === 0).map((task, i) => ({
    comment_id: 501 + i, task_id: task.task_id, comment_text: i % 2 === 0 ? "The pilot material is ready for review." : "Please check the missing citations before the next meeting.",
    user_id: collaborations.find((collab) => collab.collab_id === task.collab_id).owner_id,
    commented_at: at(-3, 2, i),
  }));
  const schedules = collaborations.flatMap((collab, i) => [0, 1, 2].map((offset) => ({
    ScheduleID: 601 + i * 3 + offset, CollabID: collab.collab_id,
    ScheduleTitle: ["Research planning", "Weekly progress review", "Report presentation"][offset],
    ScheduleTimeStart: at(collab.collab_archive_status ? -21 + offset : offset * 3, 2),
    ScheduleTimeEnd: at(collab.collab_archive_status ? -21 + offset : offset * 3, 3),
    UserID: collab.owner_id, UserName: userById(collab.owner_id).user_name,
    RepeatGroup: offset === 1 ? `fixture-weekly-${collab.collab_id}` : "",
    RepeatInterval: offset === 1 ? 3 : 0,
  })));
  const folders = collaborations.flatMap((collab, i) => ["Research documents", "Meeting notes", "Empty folder"].map((name, offset) => ({
    FolderID: 701 + i * 3 + offset, FolderName: name, collab_id: collab.collab_id,
  })));
  const files = folders.filter((folder) => folder.FolderName !== "Empty folder").flatMap((folder, i) => [0, 1].map((offset) => ({
    file_id: 801 + i * 2 + offset, folder_id: folder.FolderID,
    file_name: offset === 0 ? "pilot-results.csv" : "meeting-notes.txt",
    file_size: offset === 0 ? "2.4 KB" : "850 B", updated_at: at(-2 + offset),
    file_path: `fixtures/collab/${folder.collab_id}/${folder.FolderID}/${offset === 0 ? "pilot-results.csv" : "meeting-notes.txt"}`,
    user_id: collaborations.find((collab) => collab.collab_id === folder.collab_id).owner_id,
  })));
  const notifications = [
    { NotificationID: 901, NotificationAt: at(0, 1), NotificationMsg: "Your research paper has been published.", UserIDs: [1], UserReads: [], Link: `/dashboard/repository/viewpaper/${papers[0].public_id}`, IsCollabInvite: false, InviteToken: "" },
    { NotificationID: 902, NotificationAt: at(-1), NotificationMsg: "A collaborator commented on your task.", UserIDs: [1, 2], UserReads: [1], Link: "/dashboard/collaboration/group/Khmer%20Search%20Lab/tasks?groupId=201", IsCollabInvite: false, InviteToken: "" },
    { NotificationID: 903, NotificationAt: at(-1, 4), NotificationMsg: "You have been invited to Khmer Search Lab.", UserIDs: [7], UserReads: [], Link: "", IsCollabInvite: true, InviteToken: "fixture-invite-201-7" },
  ];
  const chatSessions = [{
    SessionID: "fixture-chat-001", UserID: 1, ResearchPaperID: papers[0].research_paper_id,
    Message: [
      { id: "fixture-message-1", sender: "user", message: "What is this paper about?", timestamp: at(0, 1) },
      { id: "fixture-message-2", sender: "bot", message: "The synthetic paper compares baseline approaches for Khmer academic search. Its sample findings focus on retrieval quality and reproducibility.", metadata: { page: "1", title: papers[0].research_title }, timestamp: at(0, 1, 1) },
    ],
  }];
  const rolePermissions = (roleId) => [{
    permission_category_name: "Repository",
    permissions: ["Publish research paper", ...(roleId === 3 ? ["Research submission approval"] : [])],
  }];
  const sessions = users.filter((user) => user.user_status).map((user) => ({
    user: {
      id: user.user_id, name: user.user_name, email: user.user_email, image: user.user_profile_img,
      role: user.user_role, role_permissions: rolePermissions(user.user_role.RoleID),
      token: `fixture-token-user-${user.user_id}`,
      department: { ...departments.find((item) => item.DepartmentID === user.department_id), id: user.department_id, name: departmentView(user.department_id).name },
    },
    expires: at(365),
  }));

  const apiResponses = [];
  const response = (id, endpoint, body, userId = null) => apiResponses.push({
    id, method: "GET", path: endpoint, status: 200, acting_user_id: userId, body,
  });
  const published = papers.filter((paper) => paper.status === "published");
  response("browse", "/browse", { papers: published.map(paperView) });
  response("repository-papers", "/repository/researchlibrary", { papers: published.map(paperView) }, 1);
  response("upload-options", "/repository/uploadform", { research_types: researchTypes, departments }, 1);
  for (const paper of papers) {
    if (paper.status === "published") {
      response(`browse-${paper.public_id}`, `/browse/${paper.public_id}`, paperDetail(paper));
      response(`repository-${paper.public_id}`, `/repository/researchlibrary/${paper.public_id}`, paperDetail(paper), 1);
    }
    response(`progress-${paper.public_id}`, `/repository/researchlibrary/inprogress/${paper.public_id}`, { data: rawPaper(paper) }, paper.user_id);
    if (["awaiting", "rejected"].includes(paper.status)) {
      response(`publication-${paper.public_id}`, `/repository/mypublications/${paper.status}/${paper.public_id}`, reviewDetail(paper), paper.user_id);
    }
    if (paper.status === "awaiting") {
      response(`submission-${paper.public_id}`, `/repository/submissions/${paper.public_id}`, reviewDetail(paper), 4);
    }
  }
  for (const session of sessions) {
    const ownPapers = papers.filter((paper) => paper.user_id === session.user.id);
    const summary = (paper) => ({ research_paper_id: paper.research_paper_id, public_id: paper.public_id, research_title: paper.research_title });
    response(`publications-user-${session.user.id}`, "/repository/mypublications", {
      awaiting_papers: ownPapers.filter((paper) => paper.status === "awaiting").map(summary),
      rejected_papers: ownPapers.filter((paper) => paper.status === "rejected").map(summary),
      published_papers: ownPapers.filter((paper) => paper.status === "published").map(paperView),
    }, session.user.id);
    const visible = collaborations.filter((collab) => collab.member_ids.includes(session.user.id));
    response(`groups-user-${session.user.id}`, "/collab/", { collab_list: {
      active: visible.filter((collab) => !collab.collab_archive_status).map(collabView).map((collab) => ({ ...collab, actions: collab.owner_info.user_id === session.user.id ? ["Edit", "Archive", "Delete", "Permissions"] : ["Leave"] })),
      archived: visible.filter((collab) => collab.collab_archive_status).map(collabView).map((collab) => ({ ...collab, actions: collab.owner_info.user_id === session.user.id ? ["Unarchive", "Delete"] : ["Leave"] })),
    } }, session.user.id);
    const scheduledGroups = visible.filter((collab) => !collab.collab_archive_status);
    const scheduleQuery = scheduledGroups.map((collab) => `collab_ids=${collab.collab_id}`).join("&");
    response(`calendar-user-${session.user.id}`, `/schedule/getwithfilter${scheduleQuery ? `?${scheduleQuery}` : ""}`, {
      collab_schedules: scheduledGroups.map((collab) => ({
        collab_id: collab.collab_id, collab_name: collab.collab_name, collab_color: collab.collab_color,
        schedules: schedules.filter((schedule) => schedule.CollabID === collab.collab_id),
      })),
    }, session.user.id);
    const userNotifications = notifications.filter((item) => item.UserIDs.includes(session.user.id)).map((Notification) => ({ Notification, IsRead: Notification.UserReads.includes(session.user.id) }));
    response(`notifications-user-${session.user.id}`, "/notifications", { notifications: userNotifications, allRead: userNotifications.every((item) => item.IsRead) }, session.user.id);
  }
  const awaiting = papers.filter((paper) => paper.status === "awaiting" && paper.department_ids.includes(1));
  response("department-submissions", "/repository/submissions", {
    department: departmentView(1), message: "Synthetic department submissions",
    papers: awaiting.map(paperView), total_awaiting: awaiting.length,
    total_rejected: papers.filter((paper) => paper.status === "rejected" && paper.department_ids.includes(1)).length,
    total_research_papers: papers.filter((paper) => paper.department_ids.includes(1)).length,
  }, 4);
  for (const collab of collaborations) {
    response(`collab-${collab.collab_id}`, `/collab/${collab.collab_id}/get`, { collab: collabView(collab) }, collab.owner_id);
    response(`members-${collab.collab_id}`, `/collab/${collab.collab_id}/getmembers`, { members: collab.member_ids.map(userById) }, collab.owner_id);
    const groupTasks = tasks.filter((task) => task.collab_id === collab.collab_id);
    response(`tasks-${collab.collab_id}`, `/collab/${collab.collab_id}/task/getalltasks`, {
      collab_archive_status: String(collab.collab_archive_status), collab_name: collab.collab_name,
      tasks: taskStatuses.map((status) => ({ ...status, task_details: groupTasks.filter((task) => task.task_status_id === status.task_status_id).map((task) => ({
        task_id: String(task.task_id), task_title: task.task_title, task_priority: task.task_priority,
        status_updated_at: task.status_updated_at, task_assignee: task.assignee_ids.map(userById),
      })) })),
    }, collab.owner_id);
    for (const task of groupTasks) {
      response(`subtasks-${task.task_id}`, `/collab/${collab.collab_id}/task/getsubtasks?task_id=${task.task_id}`, { task_id: task.task_id, subtasks: subtasks.filter((subtask) => subtask.TaskID === task.task_id) }, collab.owner_id);
      response(`comments-${task.task_id}`, `/collab/${collab.collab_id}/task/gettaskcomments?task_id=${task.task_id}`, { task_id: task.task_id, comments: comments.filter((comment) => comment.task_id === task.task_id).map((comment) => ({ comment_id: comment.comment_id, comment_text: comment.comment_text, commented_by: userById(comment.user_id), commented_at: comment.commented_at })) }, collab.owner_id);
      response(`assignees-${task.task_id}`, `/collab/${collab.collab_id}/task/getassignee?task_id=${task.task_id}`, { task_id: task.task_id, assignees: task.assignee_ids.map(userById) }, collab.owner_id);
    }
    response(`schedules-${collab.collab_id}`, `/collab/${collab.collab_id}/schedule/get`, {
      collab: { CollabID: collab.collab_id, CollabName: collab.collab_name, CollabColor: collab.collab_color },
      schedules: schedules.filter((schedule) => schedule.CollabID === collab.collab_id),
    }, collab.owner_id);
    const groupFolders = folders.filter((folder) => folder.collab_id === collab.collab_id);
    response(`folders-${collab.collab_id}`, `/collab/${collab.collab_id}/file/getfolders`, { folders: groupFolders.map(({ FolderID, FolderName }) => ({ FolderID, FolderName })) }, collab.owner_id);
    for (const folder of groupFolders) {
      const folderFiles = files.filter((file) => file.folder_id === folder.FolderID);
      response(`files-${folder.FolderID}`, `/collab/${collab.collab_id}/file/getfiles?folder_id=${folder.FolderID}&page=1&count=10`, {
        success: true, message: "Synthetic folder contents", collab_archive_status: collab.collab_archive_status,
        folder: { folder_id: folder.FolderID, folder_name: folder.FolderName, total_files: folderFiles.length,
          files: folderFiles.map(({ folder_id, user_id, ...file }) => ({ ...file, user_details: userById(user_id) })) },
      }, collab.owner_id);
    }
    response(`permissions-${collab.collab_id}`, `/collab/permissions?collab_id=${collab.collab_id}`, {
      collab_id: collab.collab_id,
      permissions: Object.fromEntries(["Create task", "Edit task", "Delete task", "Upload file", "Edit file", "Delete file", "Add schedule event", "Edit schedule event", "Delete schedule event"].map((name) => [name, !collab.collab_archive_status])),
    }, collab.owner_id);
  }
  response("chat-session", `/chat/session/${chatSessions[0].SessionID}`, { session: chatSessions[0] }, 1);
  apiResponses.push({
    id: "chat-answer", service: "semantic-search", method: "POST", path: "/chat",
    status: 200, acting_user_id: 1,
    body: { answer: chatSessions[0].Message[1].message, metadata: chatSessions[0].Message[1].metadata },
  });

  return {
    metadata: {
      format: "scholarize.frontend-fixtures/v1", reference_date: referenceDate,
      timezone: "Asia/Phnom_Penh", synthetic: true, default_user_id: 1,
      notes: ["API fixtures, not a database backup.", "Tokens and invite codes are inert placeholders, not valid credentials.", "File and PDF paths are metadata placeholders; binary assets are not included.", "API response bodies exclude the success/data wrappers added by frontend server actions."],
    },
    entities: { roles, departments, researchTypes, users, papers, collaborations, taskStatuses, tasks, subtasks, comments, schedules, folders, files, notifications, chatSessions },
    sessions, apiResponses,
    scenarios: {
      empty_library: { status: 200, body: { papers: [] } },
      empty_notifications: { status: 200, body: { notifications: [], allRead: true } },
      empty_groups: { status: 200, body: { collab_list: { active: [], archived: [] } } },
      expired_token: { status: 401, body: { error: "Token invalid! Please login again!" } },
      forbidden: { status: 403, body: { error: "Forbidden" } },
      not_found: { status: 404, body: { error: "Research paper not found" } },
      unavailable: { status: 503, body: { error: "Synthetic service unavailable" } },
    },
  };
}

function validateDump(dump) {
  const e = dump.entities;
  const unique = (items, key) => {
    const ids = items.map((item) => item[key]);
    assert.ok(ids.every((id) => id !== undefined), `Missing ${key}`);
    assert.equal(new Set(ids).size, ids.length, `Duplicate ${key}`);
    return new Set(ids);
  };
  const userIds = unique(e.users, "user_id");
  const departmentIds = unique(e.departments, "DepartmentID");
  const roleIds = unique(e.roles, "RoleID");
  const researchTypeIds = unique(e.researchTypes, "ResearchTypeID");
  unique(e.papers, "research_paper_id");
  unique(e.papers, "public_id");
  const collabIds = unique(e.collaborations, "collab_id");
  const taskIds = unique(e.tasks, "task_id");
  const statusIds = unique(e.taskStatuses, "task_status_id");
  unique(e.subtasks, "SubtaskID");
  unique(e.comments, "comment_id");
  unique(e.schedules, "ScheduleID");
  const folderIds = unique(e.folders, "FolderID");
  unique(e.files, "file_id");
  unique(e.notifications, "NotificationID");
  unique(e.chatSessions, "SessionID");
  unique(dump.apiResponses, "id");
  for (const user of e.users) {
    assert.ok(departmentIds.has(user.department_id));
    assert.ok(roleIds.has(user.user_role.RoleID));
  }
  for (const paper of e.papers) {
    assert.ok(userIds.has(paper.user_id));
    assert.ok(paper.department_ids.every((id) => departmentIds.has(id)));
    assert.ok(researchTypeIds.has(paper.research_type_id));
    assert.ok(["published", "awaiting", "rejected", "unpublished"].includes(paper.status));
    assert.equal(Boolean(paper.published_at), paper.status === "published");
    if (paper.published_at) assert.ok(Date.parse(paper.published_at) >= Date.parse(paper.submitted_at));
  }
  for (const collab of e.collaborations) {
    assert.ok(collab.member_ids.includes(collab.owner_id));
    assert.ok(collab.member_ids.every((id) => userIds.has(id)));
    assert.equal(new Set(collab.member_ids).size, collab.member_ids.length);
    assert.ok(collab.pending_invite_ids.every((id) => userIds.has(id) && !collab.member_ids.includes(id)));
  }
  for (const task of e.tasks) {
    assert.ok(collabIds.has(task.collab_id));
    assert.ok(statusIds.has(task.task_status_id));
    const collab = e.collaborations.find((item) => item.collab_id === task.collab_id);
    assert.ok(task.assignee_ids.every((id) => collab.member_ids.includes(id)));
  }
  for (const subtask of e.subtasks) assert.ok(taskIds.has(subtask.TaskID));
  for (const comment of e.comments) {
    assert.ok(taskIds.has(comment.task_id));
    const task = e.tasks.find((item) => item.task_id === comment.task_id);
    assert.ok(e.collaborations.find((item) => item.collab_id === task.collab_id).member_ids.includes(comment.user_id));
  }
  for (const schedule of e.schedules) {
    assert.ok(collabIds.has(schedule.CollabID));
    assert.ok(e.collaborations.find((item) => item.collab_id === schedule.CollabID).member_ids.includes(schedule.UserID));
    assert.ok(Date.parse(schedule.ScheduleTimeStart) < Date.parse(schedule.ScheduleTimeEnd));
  }
  for (const folder of e.folders) assert.ok(collabIds.has(folder.collab_id));
  for (const file of e.files) {
    assert.ok(folderIds.has(file.folder_id));
    const folder = e.folders.find((item) => item.FolderID === file.folder_id);
    assert.ok(e.collaborations.find((item) => item.collab_id === folder.collab_id).member_ids.includes(file.user_id));
  }
  for (const notification of e.notifications) {
    assert.ok(notification.UserIDs.every((id) => userIds.has(id)));
    assert.ok(notification.UserReads.every((id) => notification.UserIDs.includes(id)));
  }
  for (const session of e.chatSessions) {
    assert.ok(userIds.has(session.UserID));
    assert.ok(e.papers.some((paper) => paper.research_paper_id === session.ResearchPaperID));
  }
  for (const fixture of dump.apiResponses) {
    assert.ok(fixture.path.startsWith("/"));
    assert.ok(fixture.acting_user_id === null || userIds.has(fixture.acting_user_id));
    if (fixture.id.startsWith("publications-user-")) {
      for (const paper of Object.values(fixture.body).flat()) {
        const source = e.papers.find((item) => item.research_paper_id === paper.research_paper_id);
        assert.equal(source.user_id, fixture.acting_user_id);
      }
    }
  }
  return dump;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== "--date")) {
    throw new Error("Usage: node scripts/generate-test-data.cjs [--date YYYY-MM-DD]");
  }
  const dump = validateDump(buildDump(args[1] || new Date().toISOString().slice(0, 10)));
  const output = path.resolve(__dirname, "../test-data/scholarize.dump.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(dump, null, 2)}\n`);
  console.log(`Created ${output}`);
  console.log(`${dump.entities.users.length} users, ${dump.entities.papers.length} papers, ${dump.entities.collaborations.length} groups, ${dump.entities.tasks.length} tasks, ${dump.apiResponses.length} API fixtures. Reference date: ${dump.metadata.reference_date}.`);
}

module.exports = { buildDump, validateDump };
