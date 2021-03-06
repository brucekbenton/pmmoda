GO
/****** Object:  Table [dbo].[AccessControl]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccessControl](
	[WebServiceID] [int] NOT NULL,
	[MethodID] [int] NOT NULL,
	[ProtectionLevelID] [int] NULL,
	[SecurityRoleID] [int] NULL,
 CONSTRAINT [PK_AccessControl] PRIMARY KEY CLUSTERED 
(
	[WebServiceID] ASC,
	[MethodID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[CommandLog]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommandLog](
	[logID] [int] IDENTITY(1,1) NOT NULL,
	[Datetime] [datetime] NOT NULL,
	[Module] [nvarchar](50) NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
	[CommandString] [nvarchar](1024) NOT NULL,
	[returnCode] [int] NOT NULL,
 CONSTRAINT [PK_CommandLog] PRIMARY KEY CLUSTERED 
(
	[logID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[Company]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Company](
	[CompanyID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[ContactName] [nvarchar](50) NOT NULL,
	[ContactAlias] [nvarchar](50) NOT NULL,
	[DomainName] [nvarchar](50) NOT NULL,
	[OrganizationRestriction] [bit] NOT NULL,
	[ProjectRestriction] [bit] NOT NULL,
	[AdminRestriction] [bit] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_Company] PRIMARY KEY CLUSTERED 
(
	[CompanyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ,
 CONSTRAINT [AK_ContactAlias] UNIQUE NONCLUSTERED 
(
	[ContactAlias] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ,
 CONSTRAINT [AK_DomainName] UNIQUE NONCLUSTERED 
(
	[DomainName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ,
 CONSTRAINT [AK_Name] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[Deliverable]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Deliverable](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ParentID] [int] NULL,
	[ProjectID] [int] NOT NULL,
	[WorkstreamID] [int] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[CrossReference] [nvarchar](50) NULL,
	[Description] [nvarchar](255) NULL,
	[percentComplete] [float] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
	[hasChildren] [bit] NOT NULL,
 CONSTRAINT [PK_Deliverable] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[DeliverableModel]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE TABLE [dbo].[DeliverableModel] (
    [ID]              INT             IDENTITY (1, 1) NOT NULL,
    [DeliverableID]   INT             NOT NULL,
    [NaturalUnitID]   INT             NOT NULL,
    [Assumptions]     NVARCHAR (1024) NULL,
    [LowCount]        FLOAT (53)      CONSTRAINT [DF_DeliverableModel_LowCount] DEFAULT ((0)) NOT NULL,
    [MedCount]        FLOAT (53)      CONSTRAINT [DF_DeliverableModel_MedCount] DEFAULT ((0)) NOT NULL,
    [HighCount]       FLOAT (53)      CONSTRAINT [DF_DeliverableModel_HighCount] DEFAULT ((0)) NOT NULL,
    [CreateDate]      DATETIME        CONSTRAINT [DF_DeliverableModel_CreateDate] DEFAULT (getdate()) NOT NULL,
    [CreatedBy]       INT             NOT NULL,
    [ModifyDate]      DATETIME        NULL,
    [ModifiedBy]      INT             NULL,
    [isActive]        BIT             CONSTRAINT [DF_DeliverableModel_isActive] DEFAULT ((1)) NOT NULL,
    [percentComplete] FLOAT (53)      NULL,
    [IterationCount] FLOAT NULL, 
    CONSTRAINT [PK_DeliverableModel] PRIMARY KEY CLUSTERED ([ID] ASC)
);

GO
/****** Object:  Table [dbo].[Dimension]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dimension](
	[DimensionID] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[RoleID] [int] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_Dimension] PRIMARY KEY CLUSTERED 
(
	[DimensionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[MasterRole]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MasterRole](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[CompanyID] [int] NULL,
	[Description] [nvarchar](255) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_MasterRoles] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[NaturalUnit]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NaturalUnit](
	[NaturalUnitID] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationID] [int] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NOT NULL,
	[LoNominalEffort] [float] NULL,
	[LoAverageEffort] [float] NULL,
	[MedNominalEffort] [float] NULL,
	[MedAverageEffort] [float] NULL,
	[HiNominalEffort] [float] NULL,
	[HiAverageEffort] [float] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_NaturalUnit] PRIMARY KEY CLUSTERED 
(
	[NaturalUnitID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[Organization]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Organization](
	[OrganizationId] [int] IDENTITY(1,1) NOT NULL,
	[CompanyID] [int] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NULL,
	[WorkDay] [float] NULL,
 CONSTRAINT [PK_Organization] PRIMARY KEY CLUSTERED 
(
	[OrganizationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[Project]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[ProjectID] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NOT NULL,
	[Purpose] [ntext] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
	[ProjectStatus] [int] NULL,
	[BaselineEffort] [float] NULL,
	[PercentLoading] [float] NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
 CONSTRAINT [PK_Project] PRIMARY KEY CLUSTERED 
(
	[ProjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[Role]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[RoleID] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[MasterRoleID] [int] NULL,
	[Overhead] [float] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Staffing](
	[ProjectID] [int] NOT NULL,
	[MasterRoleID] [int] NOT NULL,
	[Count] [float] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_Staffing] PRIMARY KEY CLUSTERED 
(
	[ProjectID] ASC,
	[MasterRoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

ALTER TABLE [dbo].[Staffing] ADD  CONSTRAINT [DF_Staffing_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[Staffing] ADD  CONSTRAINT [DF_Staffing_isActive]  DEFAULT ((1)) FOR [isActive]
GO



/****** Object:  Table [dbo].[UnitDimension]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UnitDimension](
	[NaturalUnitID] [int] NOT NULL,
	[DimensionID] [int] NOT NULL,
	[OrganizationID] [int] NOT NULL,
	[LoAverageEffort] [float] NULL,
	[LoNominalEffort] [float] NULL,
	[MedAverageEffort] [float] NULL,
	[MedNominalEffort] [float] NULL,
	[HiAverageEffort] [float] NULL,
	[HiNominalEffort] [float] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_UnitDimension] PRIMARY KEY CLUSTERED 
(
	[NaturalUnitID] ASC,
	[DimensionID] ASC,
	[OrganizationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO
/****** Object:  Table [dbo].[Users]    Script Date: 10/19/2015 9:53:52 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyID] [int] NOT NULL,
	[alias] [nvarchar](50) NOT NULL,
	[RoleID] [int] NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
	[EmailAddress] [nvarchar](50) NULL
) 

GO

ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_isActive]  DEFAULT ((1)) FOR [isActive]
GO





CREATE TABLE [dbo].[AspNetUsers] (
    [Id]                   NVARCHAR (128) NOT NULL,
    [Email]                NVARCHAR (256) NULL,
    [EmailConfirmed]       BIT            NOT NULL,
    [PasswordHash]         NVARCHAR (MAX) NULL,
    [SecurityStamp]        NVARCHAR (MAX) NULL,
    [PhoneNumber]          NVARCHAR (MAX) NULL,
    [PhoneNumberConfirmed] BIT            NOT NULL,
    [TwoFactorEnabled]     BIT            NOT NULL,
    [LockoutEndDateUtc]    DATETIME       NULL,
    [LockoutEnabled]       BIT            NOT NULL,
    [AccessFailedCount]    INT            NOT NULL,
    [UserName]             NVARCHAR (256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex]
    ON [dbo].[AspNetUsers]([UserName] ASC);


	CREATE TABLE [dbo].[AspNetRoles] (
    [Id]   NVARCHAR (128) NOT NULL,
    [Name] NVARCHAR (256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex]
    ON [dbo].[AspNetRoles]([Name] ASC);

CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] NVARCHAR (128) NOT NULL,
    [RoleId] NVARCHAR (128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
    CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_UserId]
    ON [dbo].[AspNetUserRoles]([UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_RoleId]
    ON [dbo].[AspNetUserRoles]([RoleId] ASC);


	CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [UserId]     NVARCHAR (128) NOT NULL,
    [ClaimType]  NVARCHAR (MAX) NULL,
    [ClaimValue] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_UserId]
    ON [dbo].[AspNetUserClaims]([UserId] ASC);

CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] NVARCHAR (128) NOT NULL,
    [ProviderKey]   NVARCHAR (128) NOT NULL,
    [UserId]        NVARCHAR (128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider] ASC, [ProviderKey] ASC, [UserId] ASC),
    CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
);


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[StaffingModel](
	[ModelID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_StaffingModel] PRIMARY KEY CLUSTERED 
(
	[ModelID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

ALTER TABLE [dbo].[StaffingModel] ADD  CONSTRAINT [DF_StaffingModel_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[StaffingModel] ADD  CONSTRAINT [DF_StaffingModel_isActive]  DEFAULT ((1)) FOR [isActive]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[StaffingModelRole](
	[ModelRoleID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[Name] [nvarchar](24) NOT NULL,
	[Description] [nvarchar](1024) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_StaffingModelRole_1] PRIMARY KEY CLUSTERED 
(
	[ModelRoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

ALTER TABLE [dbo].[StaffingModelRole] ADD  CONSTRAINT [DF_StaffingModelRole_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[StaffingModelRole] ADD  CONSTRAINT [DF_StaffingModelRole_isActive]  DEFAULT ((1)) FOR [isActive]
GO
CREATE TABLE [dbo].[ReferenceRole] (
    [RefRoleID]     INT             IDENTITY (1, 1) NOT NULL,
    [Name]        NVARCHAR (50)   NOT NULL,
    [Description] NVARCHAR (1024) NULL,
    [CreateDate]  DATETIME        CONSTRAINT [DF_ReferenceRole_CreateDate] DEFAULT (getdate()) NOT NULL,
    [CreatedBy]   INT             NOT NULL,
    [ModifyDate]  DATETIME        NULL,
    [ModifiedBy]  INT             NULL,
    [isActive]    BIT             CONSTRAINT [DF_ReferenceRole_isActive] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_ReferenceRole] PRIMARY KEY CLUSTERED ([RefRoleID] ASC)
);

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ApplicationType](
	[TypeID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_ApplicationType] PRIMARY KEY CLUSTERED 
(
	[TypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

ALTER TABLE [dbo].[ApplicationType] ADD  CONSTRAINT [DF_ApplicationType_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[ApplicationType] ADD  CONSTRAINT [DF_ApplicationType_isActive]  DEFAULT ((1)) FOR [isActive]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ReferenceComponent](
	[RefComponentID] [int] IDENTITY(1,1) NOT NULL,
	[TypeID] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isACtive] [bit] NOT NULL,
 CONSTRAINT [PK_ReferenceComponent] PRIMARY KEY CLUSTERED 
(
	[RefComponentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

ALTER TABLE [dbo].[ReferenceComponent] ADD  CONSTRAINT [DF_ReferenceComponent_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[ReferenceComponent] ADD  CONSTRAINT [DF_ReferenceComponent_isACtive]  DEFAULT ((1)) FOR [isACtive]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ReferenceActivity](
	[RefActivityID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NOT NULL,
	[RefRoleID] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](1024) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isACtive] [bit] NOT NULL,
 CONSTRAINT [PK_ReferenceActivity] PRIMARY KEY CLUSTERED 
(
	[RefActivityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) 
) 

GO

ALTER TABLE [dbo].[ReferenceActivity] ADD  CONSTRAINT [DF_ReferenceActivity_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[ReferenceActivity] ADD  CONSTRAINT [DF_ReferenceActivity_isACtive]  DEFAULT ((1)) FOR [isACtive]
GO



SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ReferenceActivityMap](
	[ApplicationTypeID] [int] NOT NULL,
	[StaffingModelID] [int] NOT NULL,
	[NaturalUnitID] [int] NOT NULL,
	[DimensionID] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifyDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[isActive] [bit] NOT NULL
) 

GO

ALTER TABLE [dbo].[ReferenceActivityMap] ADD  CONSTRAINT [DF_ReferenceActivityMap_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [dbo].[ReferenceActivityMap] ADD  CONSTRAINT [DF_ReferenceActivityMap_isActive]  DEFAULT ((1)) FOR [isActive]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ConditionType](
	[ConditionTypeID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](24) NOT NULL
)

GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProjectCondition](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ProjectID] [int] NOT NULL,
	[ActivityID] [int] NOT NULL,
	[DependencyID] [int] NOT NULL,
	[CompletionPercentage] [float] NOT NULL,
	[ConditionTypeID] [int] NOT NULL,
	[isActive] [bit] NOT NULL
) 

GO



GO
CREATE NONCLUSTERED INDEX [IX_UserId]
    ON [dbo].[AspNetUserLogins]([UserId] ASC);



GO
ALTER TABLE [dbo].[Company] ADD  CONSTRAINT [DF_Company_OrganizationRestriction]  DEFAULT ((0)) FOR [OrganizationRestriction]
GO
ALTER TABLE [dbo].[Company] ADD  CONSTRAINT [DF_Company_ProjectRestriction]  DEFAULT ((0)) FOR [ProjectRestriction]
GO
ALTER TABLE [dbo].[Company] ADD  CONSTRAINT [DF_Company_AdminRestriction]  DEFAULT ((1)) FOR [AdminRestriction]
GO
ALTER TABLE [dbo].[Company] ADD  CONSTRAINT [DF_Company_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[Company] ADD  CONSTRAINT [DF_Company_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Deliverable] ADD  CONSTRAINT [DF_Deliverable_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[Deliverable] ADD  CONSTRAINT [DF_Deliverable_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Deliverable] ADD  CONSTRAINT [DF_Deliverable_hasChildren]  DEFAULT ((0)) FOR [hasChildren]
GO
ALTER TABLE [dbo].[DeliverableModel] ADD  CONSTRAINT [DF_DeliverableModel_LowCount]  DEFAULT ((0)) FOR [LowCount]
GO
ALTER TABLE [dbo].[DeliverableModel] ADD  CONSTRAINT [DF_DeliverableModel_MedCount]  DEFAULT ((0)) FOR [MedCount]
GO
ALTER TABLE [dbo].[DeliverableModel] ADD  CONSTRAINT [DF_DeliverableModel_HighCount]  DEFAULT ((0)) FOR [HighCount]
GO
ALTER TABLE [dbo].[DeliverableModel] ADD  CONSTRAINT [DF_DeliverableModel_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[DeliverableModel] ADD  CONSTRAINT [DF_DeliverableModel_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Dimension] ADD  CONSTRAINT [DF_Dimension_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[MasterRole] ADD  CONSTRAINT [DF_MasterRoles_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[MasterRole] ADD  CONSTRAINT [DF_MasterRoles_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[NaturalUnit] ADD  CONSTRAINT [DF_NaturalUnit_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[NaturalUnit] ADD  CONSTRAINT [DF_NaturalUnit_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Organization] ADD  CONSTRAINT [DF_Organization_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[Organization] ADD  CONSTRAINT [DF_Organization_ModifiedDate]  DEFAULT (getdate()) FOR [ModifiedDate]
GO
ALTER TABLE [dbo].[Organization] ADD  CONSTRAINT [DF_Organization_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Project] ADD  CONSTRAINT [DF_Project_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[Project] ADD  CONSTRAINT [DF_Project_ProjectStatus]  DEFAULT ((0)) FOR [ProjectStatus]
GO
ALTER TABLE [dbo].[Role] ADD  CONSTRAINT [DF_Role_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[Role] ADD  CONSTRAINT [DF_Role_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[UnitDimension] ADD  CONSTRAINT [DF_UnitDimension_CreateDate]  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[UnitDimension] ADD  CONSTRAINT [DF_UnitDimension_isActive]  DEFAULT ((1)) FOR [isActive]
GO
