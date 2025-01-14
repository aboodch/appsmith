package com.appsmith.server.events;

import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Workspace;
import lombok.Data;

@Data
public abstract class AbstractCommentEvent {
    private final String authorUserName;
    private final Workspace organization;
    private final Application application;
    private final String originHeader;
    private final String pageName;
}
