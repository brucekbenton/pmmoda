GO
/****** Object:  StoredProcedure [dbo].[ActivityInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[ActivityInsert]
	@ComponentTypeID int,
	@roleID int,
	@BaseUnitID int,
	@LoNominalEffort float,
	@MedNominalEffort float,
	@HiNominalEffort float,
	@UserID int

AS

BEGIN

	INSERT ComponentTypeActivity (ComponentTypeID, RoleID, NaturalUnitID, LoNominalEffort, MEdNominalEffort, HiNominalEffort, CreatedBy)
	VALUES (@ComponentTypeID, @roleID, @BaseUnitID, @LoNominalEffort, @MedNominalEffort, @HiNominalEffort, @UserID)

	DECLARE @keyValue int
	SELECT @keyValue = SCOPE_IDENTITY()

	Return 
END


GO
/****** Object:  StoredProcedure [dbo].[CommandLogInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CommandLogInsert] 
	-- Add the parameters for the stored procedure here
	@ModuleName nvarchar(50),
	@OrganizationID int,
	@UserID int,
	@CommandString nvarchar(1024),
	@returnCode int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT CommandLog (Datetime, Module,OrganizationID,UserID,CommandString,returnCode)
	VALUES (GetDate(),@ModuleName,@OrganizationID,@UserID,@CommandString,@returnCode)

END


GO
/****** Object:  StoredProcedure [dbo].[CompanyGetByID]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CompanyGetByID] 
	-- Add the parameters for the stored procedure here
	@CompanyID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	CompanyID,
			Name,
			ContactName,
			ContactAlias,
			DomainName,
			OrganizationRestriction,
			ProjectRestriction,
			isActive
	FROM	Company
	WHERE	CompanyID = @CompanyID

	END

GO
/****** Object:  StoredProcedure [dbo].[CompanyGetByUser]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CompanyGetByUser] 
	-- Add the parameters for the stored procedure here
	@Username nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	C.CompanyID,
			Name,
			C.ContactName,
			C.ContactAlias,
			C.DomainName,
			C.OrganizationRestriction,
			C.ProjectRestriction,
			C.isActive
	FROM	Company C
	JOIN	Users PU on (C.CompanyID = PU.CompanyID)
	WHERE	PU.alias = @Username
END

GO

/****** Object:  StoredProcedure [dbo].[CompanyInsert]    Script Date: 10/20/2015 8:12:13 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CompanyInsert] 
	-- Add the parameters for the stored procedure here
	@Name nvarchar(50),
	@ContactName nvarchar(50),
	@ContactAlias nvarchar(50),
	@DomainName nvarchar(50),
	@OrganizationRestriction bit,
	@ProjectRestriction bit,
	@isActive bit,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Declare an internal variable to store the company ID
	Declare @ID int

    -- Insert statements for procedure here
	INSERT COMPANY (Name, 
					ContactName, 
					ContactAlias, 
					DomainName, 
					OrganizationRestriction,
					ProjectRestriction,
					isActive,
					CreatedBy)
	VALUES	(@Name,
			@ContactNAme,
			@ContactAlias,
			@DomainName,
			@OrganizationRestriction,
			@ProjectRestriction,
			@isActive,
			@UserID)


	set @ID = (select @@identity)

	-- Insert the default Master Role
	INSERT	MasterRole (Name, CompanyID, Description, CreatedBy, isActive)
	VALUES	('TeamMember',
			@ID,
			'Default company role',
			1,
			1)

	select @ID as 'Key value returned in a result set'

END

GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Create a procedure which will remove Companies and their associated 
--				first tier child records
-- =============================================
CREATE PROCEDURE CompanyRemove 
	-- Add the parameters for the stored procedure here
	@CompanyID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Remove the Master Roles associated with the current company
	DELETE MasterRole where CompanyID = @companyID

	-- Remove the Users associted with the current company
	DELETE Users WHERE CompanyID = @CompanyID

	-- Remove the Organizatons associated with the current company
	DELETE Organization WHERE	CompanyID = @CompanyID

	-- Delete the company
	DELETE Company WHERE CompanyID = @CompanyID

END
GO



GO
/****** Object:  StoredProcedure [dbo].[CompanyListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CompanyListGet] 
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	CompanyID,
			Name,
			ContactName,
			ContactAlias,
			DomainName,
			OrganizationRestriction,
			ProjectRestriction,
			AdminRestriction,
			isActive
	FROM	Company
END

GO
/****** Object:  StoredProcedure [dbo].[CompanyUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CompanyUpdate] 
	-- Add the parameters for the stored procedure here
	@CompanyID int,
	@Name nvarchar(50),
	@ContactName nvarchar(50),
	@ContactAlias nvarchar(50),
	@DomainName nvarchar(50),
	@OrganizationRestriction bit,
	@ProjectRestriction bit,
	@isActive bit,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE COMPANY 
	SET		Name = @Name, 
			ContactName = @ContactName,
			ContactAlias = @ContactAlias,
			DomainName = @DomainName, 
			OrganizationRestriction = @OrganizationRestriction,
			ProjectRestriction = @ProjectRestriction,
			isActive = @isActive,
			ModifiedBy = @UserID,
			ModifyDate = getdate()
	WHERE	CompanyID = @CompanyID

	select @@identity as 'Key value returned in a result set'

END

GO
/****** Object:  StoredProcedure [dbo].[DeliverableInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Procedure [dbo].[DeliverableInsert]
	@ParentID int,
	@ProjectID int,
	@Name nvarchar(50),
	@CrossReference nvarchar(50),
	@Description nvarchar(255),
	@UserID int

AS

BEGIN

	INSERT Deliverable (ParentID, ProjectID, Name, CrossReference,Description, CreatedBy)
	VALUES (@ParentID, @ProjectId, @Name, @CrossReference, @Description,  @UserID)

  select @@identity as 'Key value returned in a result set'

	UPDATE D1
	SET		D1.hasChildren = 1
	FROM	Deliverable D1
	JOIN	Deliverable D2
	ON	D1.ID = D2.ParentID
	where D1.ProjectID=@ProjectID


END








GO
/****** Object:  StoredProcedure [dbo].[DeliverableListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[DeliverableListGet]
	@ProjectID int
	
AS

BEGIN

SELECT	D.ID,
		D.ParentID,
		D.WorkstreamID,
		D.Name,
		D.CrossReference,
		D.Description,
		D.hasChildren,
		DM.ID as 'DeliverableModelID',
		DM.NaturalUnitID,
		NU.Name as 'NaturalUnitName',
		DM.Assumptions,
		DM.LowCount,
		DM.MedCount,
		DM.HighCount,
		DM.IterationCount,
		DM.isActive,
		DM.percentComplete

FROM	Deliverable D
LEFT OUTER JOIN	DeliverableModel DM on (D.ID = DM.DeliverableId)
LEFT OUTER JOIN NaturalUnit NU on (DM.NaturalUnitID = NU.NaturalUnitID)
WHERE	D.ProjectID = @ProjectID
AND		D.isActive = 1
ORDER BY D.ID

END

GO

/****** Object:  StoredProcedure [dbo].[DeliverableModelDelete]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE Procedure [dbo].[DeliverableModelDelete]
	@DDeliverableModelID int,
	@UserID int

AS

BEGIN

	Update	DeliverableModel 
	SET		isActive = 0,
			ModifyDate = GetDate(),
			ModifiedBy = @UserID
	WHERE	ID = @DDeliverableModelID
	 
END




GO
/****** Object:  StoredProcedure [dbo].[DeliverableModelGetList]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[DeliverableModelGetList]
	@DeliverableID int

AS

BEGIN

	SELECT	DM.ID,
			DM.NaturalUnitID,
			NU.Name,
			DM.Assumptions,
			DM.LowCount,
			DM.MedCount,
			DM.HighCount,
			DM.percentComplete
	FROM	DeliverableModel DM
	JOIN	DetailUnit NU
	ON		(NU.DetailUnitID = DM.NAturalUnitID)

	WHERE	DM.DeliverableID = @DeliverableID
	AND		DM.isActive = 1

END



GO
/****** Object:  StoredProcedure [dbo].[DeliverableModelInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[DeliverableModelInsert]
	@DeliverableID int,
	@NaturalUnitID int,
	@Assumptions nvarchar(1024),
	@LowCount float,
	@MedCount float,
	@HighCount float,
	@IterationCount float,
	@UserID int,
	@percentComplete float

AS

BEGIN

	INSERT	DeliverableModel(
				DeliverableID,
				NaturalUnitID,
				Assumptions,
				LowCount,
				MedCount,
				HighCount,
				IterationCount,
				CreatedBy,
				percentComplete)
	VALUES	(@DeliverableID,
			@NaturalUnitID,
			@Assumptions,
			@LowCount,
			@MedCount,
			@HighCount,
			@IterationCount,
			@UserID,
			@percentComplete)

	SELECT @@identity as 'Key value returned in a result set'

END

GO
/****** Object:  StoredProcedure [dbo].[DeliverableModelUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE Procedure [dbo].[DeliverableModelUpdate]
	@DeliverableModelID int,
	@Assumptions nvarchar(1024),
	@LowCount float,
	@MedCount float,
	@HighCount float,
	@IterationCount float,
	@percentComplete float,
	@UserID int


AS

BEGIN

UPDATE	DeliverableModel
	SET Assumptions = @Assumptions,
		LowCount = @LowCount,
		MedCount = @MedCount,
		HighCount = @HighCount,
		IterationCount = @IterationCount,
		ModifyDate = GetDate(),
		ModifiedBy = @UserID,
		percentComplete = @percentComplete
	WHERE ID = @DeliverableModelID

END

GO
/****** Object:  StoredProcedure [dbo].[DeliverableUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[DeliverableUpdate]
	@DeliverableID int,
	@Name nvarchar(50),
	@Description nvarchar(255),
	@CrossReference nvarchar(50),
	@WorkstreamID int,
	@UserName nvarchar(50),
	@isActive int

AS

BEGIN

DECLARE @UserID int

SET @UserID = (SELECT UserID FROM USers WHERE alias = @UserName)

UPDATE	Deliverable
SET		Name=@Name,
		CrossReference=@CrossReference,
		Description=@Description,
		WorkstreamID = @WorkstreamID,
		ModifyDate = getdate(),
		ModifiedBy = @UserID,
		isActive = @isActive
WHERE	ID = @DeliverableID

END


GO
/****** Object:  StoredProcedure [dbo].[DimensionInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[DimensionInsert]
	@OrganizationID int,
	@Name nvarchar(50),
	@Description nvarchar(1024),
	@RoleID int,
	@UserID int
AS

BEGIN

INSERT Dimension (OrganizationID, Name, Description, RoleID, CreatedBy,isActive)
VALUES (@OrganizationID, @Name,@Description, @RoleID, @USerID,1)


  select @@identity as 'Key value returned in a result set'

END




GO
/****** Object:  StoredProcedure [dbo].[DimensionListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE Procedure [dbo].[DimensionListGet]
	@OrganizationID int
	
AS

BEGIN

SELECT DimensionID, Name, Description, RoleID, isActive from Dimension WHERE OrganizationID = @OrganizationID 
ORDER BY Name

END



GO
/****** Object:  StoredProcedure [dbo].[DimensionUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[DimensionUpdate]
	@DimensionID int,
	@Name nvarchar(50),
	@Description nvarchar(1024),
	@RoleID int,
	@isActive bit,
	@UserId int

AS

BEGIN

	Update	Dimension 
	SET		Name = @Name,
			Description = @Description,
			RoleID = @RoleID,
			ModifyDate =GetDate(),
			ModifiedBy = @UserID,
			isActive = @isActive
	WHERE	DimensionID = @DimensionID
	 
END



GO
/****** Object:  StoredProcedure [dbo].[EffortRemainingGetByResource]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[EffortRemainingGetByResource]
	@SprintID int,
	@ResourceID int

AS

BEGIN

	SELECT	Sum(T.HoursRemaining) 
	FROM	Task T
	JOIN	WorkItem WI on (WI.WorkItemID = T.WorkItemID)
	JOIN	Sprint S on (S.SprintID = WI.SprintID)
	WHERE	S.SprintID = @SprintID
	AND		T.AssignedTo = @ResourceID
	Group BY S.SprintID

END


GO
/****** Object:  StoredProcedure [dbo].[MasterRoleInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[MasterRoleInsert] 
	-- Add the parameters for the stored procedure here
	@Name nvarchar(50),
	@CompanyID int,
	@Description nvarchar(255),
	@isActive bit,
	@Username nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @UserID int

	SET @UserID = (SELECT UserID From Users WHERE alias = @Username)

	INSERT	MasterRole	(Name, CompanyID,Description, CreatedBy,isActive)
			VALUES		(@Name,@CompanyID, @Description, @UserID,@isActive)

	DECLARE @newID int
	select @newID as 'Key value returned in a result set'

END

GO
/****** Object:  StoredProcedure [dbo].[MasterRoleListByCompanyGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[MasterRoleListByCompanyGet]
	@CompanyID int
AS

BEGIN

SELECT	ID,
		Name,
		Description
FROM	MasterRole
WHERE	isActive = 1
AND		CompanyID = @CompanyID
ORDER BY ID


END



GO
/****** Object:  StoredProcedure [dbo].[MasterRoleListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MasterRoleListGet]

AS

BEGIN

SELECT	ID,
		Name,
		Description
FROM	MasterRole
WHERE	isActive = 1
ORDER BY ID


END


GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE Procedure [dbo].[NaturalUnitGet]
	@ID int

AS

BEGIN


SELECT	NU.NaturalUnitID, 
		NU.Name, 
		NU.Description, 
		CT.Name,
		CT.ComponentTypeID,
		NU.LoNominalEffort, 
		NU.MedNominalEffort, 
		NU.HiNominalEffort,
		NU.LoAverageEffort, 
		NU.MedAverageEffort, 
		NU.HiAverageEffort
FROM	NaturalUnit NU
JOIN	ComponentType CT on (CT.ComponentTypeID = NU.ComponentTypeID)
WHERE	NU.NaturalUnitID = @ID

END




GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitGetDefault]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[NaturalUnitGetDefault]
	@ComponentTypeID int

AS

BEGIN


SELECT	NU.NaturalUnitID, 
		NU.Name, 
		NU.Description, 
		CT.Name,
		CT.ComponentTypeID,
		NU.LoNominalEffort, 
		NU.MedNominalEffort, 
		NU.HiNominalEffort,
		NU.LoAverageEffort, 
		NU.MedAverageEffort, 
		NU.HiAverageEffort
FROM	NaturalUnit NU
JOIN	ComponentType CT on (CT.NaturalUnitID = NU.NaturalUnitID)
WHERE	CT.ComponentTypeID = @ComponentTypeID

END



GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[NaturalUnitInsert]
	@OrganizationID int,
	@Name nvarchar(50),
	@Description nvarchar(255),
	@UserID int

AS

BEGIN

/* Insert the required Base Unit record first */

INSERT NaturalUnit (Name,Description,CreatedBy,OrganizationID)
VALUES (@Name,@Description,@UserID,@OrganizationID)

/* Get the ID of the newly created record	*/
DECLARE @UnitID int
SET		@UnitID =  @@identity

select @UnitID as 'Key value returned in a result set'
/*  select @@identity as 'Key value returned in a result set'*/

END


GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitListGetByComponent]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE Procedure [dbo].[NaturalUnitListGetByComponent]
	@componentTYpeID int

AS

BEGIN


SELECT	NU.NaturalUnitID, 
		NU.Name, 
		NU.Description, 
		CT.Name,
		CT.ComponentTypeID,
		NU.LoNominalEffort, 
		NU.MedNominalEffort, 
		NU.HiNominalEffort,
		NU.LoAverageEffort, 
		NU.MedAverageEffort, 
		NU.HiAverageEffort
FROM	NaturalUnit NU
JOIN	ComponentType CT on (NU.ComponentTypeID = CT.ComponentTypeID)
WHERE	NU.ComponentTypeID = @ComponentTypeID

END





GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitListGetByOrganization]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE Procedure [dbo].[NaturalUnitListGetByOrganization]
	@OrganizationID int

AS

BEGIN


SELECT	NU.NaturalUnitID, 
		NU.Name, 
		NU.Description,
		NU.isActive 
FROM	NaturalUnit NU
WHERE	NU.OrganizationID = @OrganizationID

END





GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitsInitialize]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[NaturalUnitsInitialize]
	@OrganizationID int,
	@UserID int

AS

BEGIN

	DECLARE @KeyValue as int

	-- insert the Client Form base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'Cient Form','client resident application form',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the USer Interface ComponentType which uses this base unit as the default unit
	INSERT ComponentType (OrganizationID, BaseUnitID, Name, Description, CreatedBy)
	VALUES (@OrganizationID, @KeyValue,'User Interface','Graphical user interface',@UserID)

	-- Insert the DetailUnits for this BaseUnit
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'UserControl','Composite user interface component built by developer',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Control','Uptake of standard user interface component provided by framework',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'EventHandler','Method implemnented to respond to user action',@UserID)

	-- insert the Web Form base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'Web Form','Server hosted, browser rendered application form',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the DetailUnits for web form
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'WebControl','Composite user interface component built by developer',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Control','Uptake of standard user interface component provided by framework',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Callback Method','Method implemnented to respond to user action',@UserID)


	-- insert the mobile client Form base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'Mobile Screen','Server hosted, browser rendered application form',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the DetailUnits for mobile form
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'UserControl','Composite user interface component built by developer',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Event Handler','Method implemnented to respond to user action',@UserID)


	-- insert the Business entity base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'Business Entity','Domain Model based logical business abstraction entity',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the USer Interface ComponentType which uses this base unit as the default unit
	INSERT ComponentType (OrganizationID, BaseUnitID, Name, Description, CreatedBy)
	VALUES (@OrganizationID, @KeyValue,'business Layer','Business logic abstraction layer',@UserID)

	-- Insert the DetailUnits for Business Entity
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Entity Class','Class implementation of logical entity',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Method','Method implemnention of logical entity capability or interaction',@UserID)


	-- insert the datbase entity base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'Database Entity','Database abstraction of logical system entity',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the USer Interface ComponentType which uses this base unit as the default unit
	INSERT ComponentType (OrganizationID, BaseUnitID, Name, Description, CreatedBy)
	VALUES (@OrganizationID, @KeyValue,'Datbase','System information storage layer',@UserID)

	-- Insert the DetailUnits for database entity
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Table','DB implementation of entity attributes',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Stored Procedure','DB implementation of entity capabilities',@UserID)

	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Trigger','DB implementation of business rule constraint',@UserID)

	-- insert the String base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'String','Text string requiring localization',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the DetailUnits for String
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Word','Basic unit of localization work',@UserID)

	-- insert the Scenario base unit
	INSERT BaseUnit (OrganizationID, Name, Description, CreatedBy)
	VALUES (@OrganizationID,'Scenario','Model of complex user interaction sequence',@USerID)

	SET @KeyValue = @@IDENTITY

	-- Insert the DetailUnits for Scenario
	INSERT DetailUnit(BaseUnitID,Name,Description,CreatedBy)
	VALUES (@KeyValue,'Step','Basic unit of user interaction sequences',@UserID)

END


GO
/****** Object:  StoredProcedure [dbo].[NaturalUnitUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[NaturalUnitUpdate]
	@NaturalUnitID int,
	@Name nvarchar(50),
	@Description nvarchar(255),
	@isActive bit,
	@UserID int

AS

BEGIN

UPDATE	NaturalUnit
SET		Name=@Name,
		Description=@Description,
		isactive = @isActive,
		ModifyDate = getdate(),
		ModifiedBy = @UserID
WHERE	NaturalUnitID = @NaturalUnitID


END


GO
/****** Object:  StoredProcedure [dbo].[OrganizationDelete]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[OrganizationDelete]
	@OrganizationID int

AS

BEGIN
	-- Delete the NaturalUnit records associated with this org
	DELETE NaturalUnit Where ORganizationID = @OrganizationID
	-- Delete the Detail Units associated with any Base Units assigned to the current Org
	DELETE FROM DEtailUnit where BaseUnitID in (select BaseUnitID from BaseUnit where OrganizationID=@OrganizationID)
	-- Delete all Base Units associated with the current org
	DELETE BaseUnit WHERE OrganizationID = @OrganizationID

	-- Delete the ComponentActivity records associated with the current Activities
	DELETE CA FROM ComponentActivity CA
	JOIN ComponentTypeActivity CTA on (CTA.ComponentTypeActivityID = CA.ComponentTypeActivityID)
	JOIN ComponentType CT on (CT.ComponentTypeID = CTA.ComponentTypeID)
	WHERE CT.OrganizationID = @OrganizationID
	-- Delete the ComponentTypeActivity records for the current organization
	DELETE CTA FROM ComponentTypeActivity CTA 
	JOIN ComponentType CT on (CT.ComponentTypeID = CTA.ComponentTypeID)
	WHERE CT.OrganizationID = @OrganizationID
	-- Delete the Component data for the Projects associated with the current Organization
	DELETE C FROM Component C
	JOIN Project P on (P.ProjectID = C.ProjectID)
	JOIN Organization O on (O.ORganizationID = P.OrganizationID)
	WHERE O.OrganizationID = @OrganizationID
	-- Delete the Component Types associated with the current Organization
	DELETE ComponentType WHERE OrganizationID = @OrganizationID

	-- Delete Tasks associated with any applicable Work Items
	DELETE T FROM TASK T
	JOIN WorkItem WI on (WI.WorkItemID = T.WorkItemID)
	JOIN Project P on (P.ProjectID = WI.ProjectID)
	JOIN Organization O on (O.OrganizationID = P.OrganizationID)
	WHERE O.OrganizationID = @OrganizationID
	-- Delete Work Items for the project set associated with this Organization
	DELETE WI FROM WorkItem WI
	JOIN Project P on (P.ProjectID = WI.ProjectID)
	JOIN Organization O on (O.OrganizationID = P.OrganizationID)
	WHERE O.OrganizationID = @OrganizationID
	-- Delete the assigned person records to the Sprints for this organization
	DELETE SP FROM SprintPerson SP
	JOIN Sprint S on (S.SprintID = SP.SprintID)
	JOIN Project P on (P.ProjectID = S.ProjectID)
	WHERE P.OrganizationID = @OrganizationID
	-- Delete Sprints associated with the current project
	DELETE S FROM Sprint S
	JOIN Project P on (P.ProjectID = S.ProjectID)
	WHERE P.OrganizationID = @OrganizationID
	-- Delete the Projects for the current organization
	DELETE from Project WHERE OrganizationID=@OrganizationID

	-- Delete the TemplateTasks associated with the current organization
	DELETE TT FROM TemplateTask TT
	JOIN WorkItemPattern WIP on (WIP.PatternID = TT.PatternID)
	WHERE WIP.OrganizationID = @OrganizationID

	-- Delete the WorkItem PAtterns for the current organization
	DELETE WorkItemPattern WHERE OrganizationID = @OrganizationID

	-- Delete the Resources assigned to this organization
	DELETE R FROM Resource R WHERE R.OrganizationID = @OrganizationID
	-- Delete the Roles associated with this Organization
	DELETE Role WHERE OrganizationID = @OrganizationID

	-- Delete the organization record
	DELETE From Organization where OrganizationID = @OrganizationID

END



GO
/****** Object:  StoredProcedure [dbo].[OrganizationGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[OrganizationGet] 
	-- Add the parameters for the stored procedure here
	@ID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	OrganizationID,
			CompanyID,
			Name,
			Description,
			WorkDay,
			isACtive
	FROM	Organization
	WHERE	OrganizationID = @ID
END


GO
/****** Object:  StoredProcedure [dbo].[OrganizationGetAssignedPersons]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[OrganizationGetAssignedPersons]
	@OrganizationID int

AS

BEGIN

SELECT  SP.SprintID, S.Name as 'Sprint', U.UserID,R.Name as 'Role',U.alias FROM SprintPerson SP
	JOIN Users U ON SP.UserID = U.UserID
	JOIN Role R ON U.RoleID = R.RoleID
	JOIN Sprint S on S.SprintID = SP.SPrintID
	JOIN Project P on S.ProjectID = P.ProjectID
	Where P.ORganizationID = @OrganizationID

END

GO
/****** Object:  StoredProcedure [dbo].[OrganizationGetResourceData]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create Procedure [dbo].[OrganizationGetResourceData]
	@OrganizationID int
AS

BEGIN
SELECT R.RoleID, R.Name, orgR.Headcount FROM OrganizationResource orgR
	join Role R on (orgR.RoleID = R.RoleID)
	WHERE	orgR.OrganizationID = @OrganizationID

END



GO
/****** Object:  StoredProcedure [dbo].[OrganizationInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE Procedure [dbo].[OrganizationInsert]
	@Name nvarchar(50),
	@CompanyID int,
	@Description nvarchar(1024),
	@UserID int,
	@WorkDay float
AS

BEGIN

-- Insert the new organization value
INSERT Organization (Name, CompanyID, Description, WorkDay, CreatedBy)
VALUES (@Name, @CompanyID, @Description, @WorkDay, @USerID)

-- Get the identify key for the new record
DECLARE @newID int
select @newID = @@identity -- as 'Key value returned in a result set'

-- Insert a 'Default' Role for the new organization
DECLARE @MasterRoleID int

SELECT @MasterRoleID = ID From MasterRole WHERE Name = 'TeamMember'

INSERT Role (OrganizationID, MasterRoleID,CreatedBy,isActive)
VALUES (@newID,@MasterRoleID,1,1)

-- Insert a default Dimension fo rthe new organization
DECLARE @RoleID int
SELECT @RoleID = @@identity

INSERT Dimension (OrganizationID,RoleID,Name,CreatedBy,isActive)
VALUES (@newID,@RoleID,'Default',1,1)

select @newID as 'Key value returned in a result set'

END






GO
/****** Object:  StoredProcedure [dbo].[OrganizationListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


Create Procedure [dbo].[OrganizationListGet]
	@CompanyID int
AS

BEGIN

SELECT		O.OrganizationID, 
			O.Name, 
			O.Description, 
			O.WorkDay, 
			O.isActive
	FROM	Organization O
	WHERE	CompanyID = @CompanyID
END





GO
/****** Object:  StoredProcedure [dbo].[OrganizationRemove]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[OrganizationRemove] 
	-- Add the parameters for the stored procedure here
	@OrganizationID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
DELETE NaturalUnit WHERE OrganizationID = @OrganizationID
DELETE Project WHERE OrganizationID = @OrganizationID
DELETE Role WHERE OrganizationID = @OrganizationID
DELETE Dimension WHERE OrganizationID = @OrganizationID
DELETE Organization WHERE OrganizationID = @OrganizationID

END

GO
/****** Object:  StoredProcedure [dbo].[OrganizationUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[OrganizationUpdate]
	@ID int,
	@Name nvarchar(50),
	@Description nvarchar(1024),
	@isActive bit,
	@WorkDay float,
	@UserID int
AS

BEGIN

UPDATE	Organization
SET		Name = @Name,
		Description = @Description,
		WorkDay = @WorkDay,
		isActive = @isActive,
		ModifiedBy = @UserID,
		ModifiedDate = getDate()
Where	OrganizationID = @ID

END


GO
/****** Object:  StoredProcedure [dbo].[ProductivityModelGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Bruce Benton
-- Create date: September 2
-- Description:	Get the productivity model for the 
-- specified NAturalUnit and Organization
-- =============================================
CREATE PROCEDURE [dbo].[ProductivityModelGet] 
	-- Add the parameters for the stored procedure here
	@NaturalUnitID int,
	@OrganizationID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
SELECT	ud.DimensionID,
		d.Name,
		ud.LoNominalEffort,
		ud.MedNominalEffort,
		ud.HiNominalEffort
FROM	UnitDimension ud
JOIN	Dimension d on (ud.DimensionID = d.DimensionID)
WHERE	ud.NaturalUnitID = @NaturalUnitID
AND		ud.OrganizationID = @OrganizationID
AND		ud.isactive = 1
AND		d.isActive = 1
END

GO
/****** Object:  StoredProcedure [dbo].[ProductivityModelGetList]    Script Date: 10/18/2015 2:10:56 PM ******/
CREATE Procedure [dbo].[ProductivityModelGetList]
	@OrganizationID int

AS

BEGIN

	SELECT	UD.OrganizationID,
			UD.NaturalUnitID,
			NU.Name as 'UnitName',
			UD.DimensionID,
			D.Name as 'DimensionName',
			R.MasterRoleID,
			UD.LoNominalEffort,
			UD.MedNominalEffort,
			UD.HiNominalEffort,
			R.RoleID,
			R.BillRate
	FROM	UnitDimension UD
	JOIN	Dimension D on (UD.DimensionID = D.DimensionID)
	JOIN	NaturalUnit NU on (UD.NaturalUnitID = NU.NaturalUnitID)
	JOIN	Role R on (R.RoleID = D.RoleID)
	WHERE	UD.OrganizationID = @OrganizationID
	AND		UD.isActive = 1
	AND		D.isActive = 1
	AND		NU.isActive = 1

END

GO


/****** Object:  StoredProcedure [dbo].[ProductivityModelUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ProductivityModelUpdate] 
	-- Add the parameters for the stored procedure here
	@UnitID int,
	@DimensionID int,
	@OrganizationID int,
	@LoNominalEffort float,
	@MedNominalEffort float,
	@HiNominalEffort float,
	@USerID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	-- Update the existing productivity model (UnitDimension) record
	UPDATE	UnitDimension
	SET		LoNominalEffort = @LoNominalEffort,
			MedNominalEffort = @MedNominalEffort,
			HiNominalEffort = @HiNominalEffort,
			ModifyDate = getdate(),
			ModifiedBy = @UserID
	WHERE	OrganizationID = @OrganizationID
	AND		NaturalUnitID = @UnitID
	AND		DimensionID = @DimensionID

END

GO
/****** Object:  StoredProcedure [dbo].[ProjectDelete]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[ProjectDelete]
	@ProjectID int,
	@UserID int

AS

BEGIN

	UPDATE Project
	SET		ModifyDate = GetDate(),
			ModifiedBy = @UserID,
			isActive = 0
	WHERE	ProjectID = @ProjectID

END


GO
/****** Object:  StoredProcedure [dbo].[ProjectEffortEstimateGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[ProjectEffortEstimateGet]
	@PRojectID int

AS

BEGIN

select WI.WorkItemID, T.TaskID, T.Name as 'Task', NU.Name as 'NaturalUnit', T.Count, T.Effort FROM Task T
	JOIN WorkItem WI on (WI.WorkItemID = T.WorkITemID)
	JOIN Project P on (P.ProjectID = WI.ProjectID)
	JOIN NaturalUnit NU on (NU.NaturalUnitID = T.NaturalUnitID)
	WHERE P.ProjectID = @ProjectID

END


GO
/****** Object:  StoredProcedure [dbo].[ProjectGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create Procedure [dbo].[ProjectGet]
	@ProjectID int
AS

BEGIN

	SELECT	P.ProjectID,
			P.OrganizationID,
			P.NAME, 
			P.Description, 
			P.Purpose, 
			P.BaselineEffort,
			P.isActive
	FROM Project P 
	WHERE P.ProjectID = @ProjectID
END




GO
/****** Object:  StoredProcedure [dbo].[ProjectInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[ProjectInsert]
	@OrganizationID int,
	@Name nvarchar(50),
	@Description nvarchar(1024),
	@Purpose ntext,
	@Status int,
	@CreatedBy int

AS

BEGIN

DECLARE @newProject int

INSERT Project (OrganizationID, Name, Description, Purpose, ProjectStatus, CreateDate,CreatedBy,isActive)
VALUES(@OrganizationID,@Name,@Description,@Purpose, @Status, GetDate(),@CreatedBy,1)


set @newProject =  @@identity 

-- Insert the base Deliverable for the current project
INSERT Deliverable(ProjectID, Name, Description,CreatedBy)
VALUES (@newProject,@Name,'Base deliverable for ' + @Name,@CreatedBy)


SELECT @newProject as 'Key value returned in a result set'

END


GO
/****** Object:  StoredProcedure [dbo].[ProjectListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




Create Procedure [dbo].[ProjectListGet]
	@OrganizationID int
AS

BEGIN

--UPDATE Project
--	SET StartDate = S.StartDate
--	FROM Project P
--	JOIN (SELECT projectID as [projectID],min(StartDate) as [StartDate]
--		FROM Sprint
--		GROUP BY ProjectID) as S
--	on S.ProjectID = P.ProjectID


SELECT P.ProjectID, P.NAME, P.Description, P.Purpose, P.ProjectStatus, BaselineEffort, StartDate, isActive
	FROM Project P 
	WHERE P.OrganizationID = @OrganizationID
END








GO
/****** Object:  StoredProcedure [dbo].[ProjectListGetByStatus]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






Create Procedure [dbo].[ProjectListGetByStatus]
	@OrganizationID int,
	@StatusID int
AS

BEGIN

SELECT P.ProjectID, P.NAME, P.Description, P.Purpose, P.ProjectStatus, BaselineEffort
	FROM Project P 
	WHERE P.OrganizationID = @OrganizationID
	AND	  P.ProjectStatus = @StatusID
	AND isActive=1
END






GO
/****** Object:  StoredProcedure [dbo].[ProjectUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE Procedure [dbo].[ProjectUpdate]
	@ProjectID int,
	@Name nvarchar(50),
	@Description nvarchar(1024),
	@Purpose ntext,
	@isActive bit,
	@UserID int

AS

BEGIN

	UPDATE	Project
	SET		Name = @Name,
			Description = @Description,
			Purpose = @Purpose,
			ModifyDate = GetDate(),
			ModifiedBy = @UserID,
			isActive = @isActive
	WHERE	ProjectID = @ProjectID

END




GO
/****** Object:  StoredProcedure [dbo].[RoleActiveListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[RoleActiveListGet] 
	-- Add the parameters for the stored procedure here
	@OrganizationID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	distinct(D.RoleID),
			R.MasterRoleID,
			MR.Name,
			R.Overhead,
			O.WorkDay,
			R.BillRate
	FROM	Dimension D
	JOIN	Role R on (D.RoleID = R.RoleID)
	JOIN	MasterRole MR on (MR.ID = R.MasterRoleID)
	JOIN	organization O on (D.OrganizationID = O.OrganizationId)
	WHERE	O.OrganizationID = @OrganizationID
	AND		D.isActive = 1
	AND		MR.isActive = 1

END

GO


/****** Object:  StoredProcedure [dbo].[RoleDelete]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[RoleDelete]
	@RoleID int,
	@UserID int

AS

BEGIN

	Update Role	
		SET isACtive = 0,
			ModifiedBy = @UserID,
			ModifyDate = GetDate()
		WHERE RoleID = @RoleID

END


GO
/****** Object:  StoredProcedure [dbo].[RoleGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[RoleGet]
	@RoleID int
	
AS

BEGIN
SELECT	R.OrganizationID, 
		R.MasterRoleID, 
		MR.Name,
		MR.Description,
		R.Overhead,
		R.BillRate
FROM	Role R
JOIN	MasterRole MR on (R.MasterRoleID = MR.ID)
WHERE	R.RoleID = @roleID

END


GO


/****** Object:  StoredProcedure [dbo].[RoleListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[RoleListGet]
	@OrganizationID int
	
AS

BEGIN

SELECT	RoleID,
		mr.ID, 
		mr.Name, 
		mr.Description,
		r.Overhead,
		r.isActive,
		r.BillRate
FROM	Role r
JOIN	MasterRole mr on (r.MasterRoleID = mr.Id)
WHERE OrganizationID = @OrganizationID 
ORDER BY Name

END








GO
/****** Object:  StoredProcedure [dbo].[RoleUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
CREATE Procedure [dbo].[RoleUpdate]
	@RoleID int,
	@OrganizationID int,
	@MasterRoleID int,
	@Overhead float,
	@isActive bit,
	@UserID int,
	@BillRate float = null

AS

BEGIN


		-- Declare a local variable
		DECLARE @count int
		-- Initialize the local variable
		SET @count = 1
		-- Query the UnitDimension table to see if there is a record for this UnitDimension
		SELECT @count = count(*)
		FROM	Role
		WHERE	OrganizationID = @OrganizationID
		AND		MasterRoleID = @MasterRoleID

		-- check to see if there is a RoleID specified
		if(@count > 0)
			BEGIN
			-- Process the update condition

			UPDATE	Role
			SET		Overhead = @Overhead,
					isActive = @isActive,
					ModifiedBy = @UserID,
					ModifyDate = GetDate(),
					BillRate = (CASE when @BillRate IS NULL then 0 else @BillRate end)
			WHERE	OrganizationID = @OrganizationID
			AND		MasterRoleID = @MasterRoleID

			END
		ELSE
			BEGIN
			-- process the insert case
				INSERT Role(OrganizationID,MasterRoleID,Overhead,CreatedBy)
				VALUES(@OrganizationID, @MasterRoleID, @Overhead, @UserID)
  
				select @@identity as 'Key value returned in a result set'


			END


END


GO


/****** Object:  StoredProcedure [dbo].[UnitDimensionListGet]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UnitDimensionListGet] 
	-- Add the parameters for the stored procedure here
	@OrganizationID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	UD.NaturalUnitID,
			UD.DimensionID,
			UD.isActive
	FROM	UnitDimension UD
	JOIN	NaturalUnit NU on (UD.NaturalUnitID = NU.NaturalUnitID)
	JOIN	Dimension D on (UD.DimensionID = D.DimensionID)
	WHERE	UD.OrganizationID = @OrganizationID
	AND		UD.isActive = 1
	ORDER BY UD.NaturalUnitID,UD.DimensionID

END








GO
/****** Object:  StoredProcedure [dbo].[UnitDimensionUpdate]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UnitDimensionUpdate] 
	-- Add the parameters for the stored procedure here
	@OrganizationID int,
	@NaturalUnitID int,
	@DimensionID int,
	@isActive bit,
	@UserID int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- Check to see if the current record exists

	-- Declare a local variable
	DECLARE @count int
	-- Initialize the local variable
	SET @count = 1
	-- Query the UnitDimension table to see if there is a record for this UnitDimension
	SELECT @count = count(*)
	FROM	UnitDimension
	WHERE	NaturalUnitID = @NaturalUnitID
	AND		DimensionID = @DimensionID
	AND		OrganizationID = @OrganizationID

	-- Check for the returned count
	if @count > 0
		begin
			-- Update the existing record
			UPDATE	UnitDimension
			SET		isActive = @isActive,
					ModifyDate = getdate(),
					ModifiedBy = @USerID
			WHERE	OrganizationID = @OrganizationID
			AND		NaturalUnitID = @NaturalUnitID
			AND		DimensionID = @DimensionID
		end
	else
		begin
			-- insert a new record
			INSERT UnitDimension (NaturalUnitID,DimensionID,OrganizationID,isActive,CreatedBy)
			VALUES (@NaturalUnitID, @DimensionID, @OrganizationID,@isActive,@UserID)
		end


END




GO
/****** Object:  StoredProcedure [dbo].[UserGetList]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create Procedure [dbo].[UserGetList]
	

AS

BEGIN

	SELECT U.UserID, U.Alias FROM Users U
		

END



GO
/****** Object:  StoredProcedure [dbo].[UserGetListByCompany]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UserGetListByCompany] 
	-- Add the parameters for the stored procedure here
	@CompanyID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	UserID,
			CompanyID,
			Alias,
			EmailAddress,
			RoleID,
			isActive
	FROM	Users U
	WHERE	CompanyID = @CompanyID	

END

GO
/****** Object:  StoredProcedure [dbo].[UserInsert]    Script Date: 10/18/2015 2:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UserInsert] 
	-- Add the parameters for the stored procedure here
	@Username nvarchar(50),
	@EmailAddress nvarchar(50),
	@CompanyID int,
	@RoleID int,
	@isActive bit,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT Users (alias,EmailAddress,CompanyID,RoleID,CreatedBy,isActive)
	VALUES (@Username,@EmailAddress,@CompanyID,@RoleID,@UserID,@isActive)

	select @@identity as 'Key value returned in a result set'

END

GO

CREATE Procedure UserRolesGetByCompany
	@CompanyID int

AS

BEGIN

	SELECT	U.UserID,
			U.alias,
			ANR.Id,
			ANR.Name as 'Role'
	FROM	Users U
	JOIN	AspNetUsers ANU on (U.alias = ANU.Email)
	JOIN	AspNetUserRoles ANUR on (ANU.Id = ANUR.UserID)
	JOIN	AspNetRoles ANR on (ANUR.RoleID = ANR.Id)
	WHERE	U.CompanyID = @CompanyID

END

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[StaffingListGet] 
	-- Add the parameters for the stored procedure here
	@ProjectID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	s.ProjectID,
			s.MasterRoleID,
			s.Count,
			mr.Name as 'RoleName'
	FROM	Staffing s
	JOIN	MasterRole mr on (s.MasterRoleID = mr.ID)
	WHERE	ProjectID = @ProjectID
	
END

GO




/****** Object:  StoredProcedure [dbo].[StaffingUpdate]    Script Date: 10/19/2015 3:52:44 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[StaffingUpdate] 
	-- Add the parameters for the stored procedure here
	@ProjectID int,
	@MasterRoleID int,
	@Count float,
	@isActive bit,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Check to see if this record already exists
	-- Declare a local variable
	DECLARE @recordCount int
	-- Initialize the local variable
	SET @recordCount = 0
	-- Query the UnitDimension table to see if there is a record for this UnitDimension
	SELECT @recordCount = count(*)
	FROM	Staffing
	WHERE	ProjectID = @ProjectID
	AND		MasterRoleID = @MasterRoleID



	if @RecordCount > 0
		begin
			-- Update the existing record
			UPDATE	Staffing
			SET		Count = @Count,
					isActive = @isActive,
					ModifyDate = getdate(),
					ModifiedBy = @USerID
			WHERE	ProjectID = @ProjectID
			AND		MasterRoleID = @MasterRoleID
		end
	else
		begin
			-- insert a new record
			INSERT Staffing (ProjectID,MasterRoleID,Count,isActive,CreatedBy)
			VALUES (@ProjectID, @MasterRoleID, @Count,1,@UserID)
		end

END

GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE StaffingModelListGet 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	ModelID,
			Name,
			Description,
			isActive
	FROM	StaffingModel

END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ApplicationTypeListGet 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	TypeID,
			Name,
			Description,
			isActive
	FROM	ApplicationType
				
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ReferenceComponentListGet 
	@TypeID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	RefComponentID as 'ComponentID',
			TypeID,
			Name,
			Description,
			isActive
	FROM	ReferenceComponent
	WHERE	TypeID = @TypeID
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ReferenceActivityListGet 
	@ModelID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT		ra.RefActivityID as 'ActivityID',
				ra.ModelID,
				ra.RefRoleID as 'RoleID',
				ra.Name,
				smr.Name,
				ra.Description,
				ra.isActive
	FROM		ReferenceActivity ra
	JOIN		StaffingModelRole smr on (ra.RefRoleID = smr.ModelRoleID)
	WHERE		ModelID = @ModelID
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE initializeProjectTeamFromWizard
	-- Add the parameters for the stored procedure here
	@companyID int,
	@organizationID int,
	@applicationType int,
	@staffingModel int,
	@alias nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @userID int

	SET @userID = (SELECT UserID from users where alias = @alias)

	-- Add the new records to the NaturalUnit table
	INSERT INTO NaturalUnit (OrganizationID,refComponentID,Name,Description,CreatedBy,isActive)
	SELECT	@organizationID as 'OrganizationID',RC.refComponentID, RC.Name,RC.Description,@userID as 'CreatedBy',1 as 'isACtive'
	FROM	ReferenceComponent RC
	WHERE	RC.TypeID = @applicationType

	-- Add any missing roles to the Master Role table for the current company
	INSERT MasterRole (Name, CompanyID, Description,CreatedBy,isActive)
	SELECT	smr.Name, @companyID as 'CompanyID', smr.Description,@userID as 'UserID', 1 as 'isActive'
	FROM	StaffingModelRole smr
	WHERE	smr.ModelID = @staffingModel
	AND	smr.Name not in (SELECT Name FROM MasterRole Where CompanyID = @companyID)

	-- Add the records to the Role table
	INSERT Role (OrganizationID, MasterRoleID,Overhead,CreatedBy,isActive)
	SELECT	@OrganizationID, mr.ID, .25,@userID,1
	FROM	MasterRole mr
	JOIN	StaffingModelRole smr on (mr.Name = smr.Name)
	WHERE	smr.ModelID = @staffingModel
	AND		mr.CompanyID = @companyID

	-- Add the Dimensions records for the new project
	INSERT	Dimension (OrganizationID,RoleID,Name,Description,CreatedBy,isActive,refActivityID)--
	SELECT	@OrganizationID as 'OrganizationID', r.RoleID,ra.Name,ra.Description,@userID as 'CreatedBy',1 as 'isACtive',ra.RefActivityID
	FROM	Role r
	JOIN	MasterRole mr on (r.MasterRoleID =  mr.ID)
	JOIN	StaffingModelRole smr on (smr.Name = mr.Name)
	JOIN	ReferenceActivity ra on (ra.RefRoleID = smr.ModelRoleID)
	WHERE	ra.ModelID = @staffingModel
	AND		r.OrganizationID = @OrganizationID

	-- Add the UnitDimension records to map activities to components
	INSERT	UnitDimension (OrganizationID, NaturalUnitID, DimensionID, CreatedBy, isActive)
	SELECT	@OrganizationID as 'OrganizationID',nu.NaturalUnitID,d.DimensionID,@userID as 'CreatedBy',1 as 'isActive'
	FROM	ReferenceActivityMap ram
	JOIN	NaturalUnit nu on (nu.refComponentID = ram.refComponentID)
	JOIN	Dimension d on (d.refActivityID = ram.refActivityID)
	WHERE	nu.OrganizationID = @OrganizationID
	AND		d.OrganizationID = @organizationID


END
GO


Create PRocedure ConditionGetByProject
	@ProjectID int

AS


BEGIN
select	PC.ID,
		PC.ProjectID,
		PC.ActivityID,
		D.Name as 'ActivityName',
		PC.DependencyID,
		D2.Name as 'DependencyName',
		PC.CompletionPercentage,
		PC.ConditionTypeID,
		CT.Name as 'ConditionType'
from	ProjectCondition PC
JOIN	Dimension D on (PC.ActivityID = D.DimensionID)
JOIN	Dimension D2 on (PC.DependencyID = D2.DimensionID)
JOIN	ConditionType CT on (PC.ConditionTypeID = CT.ConditionTypeID)
WHERE	PC.ProjectID = @ProjectID
AND		PC.isActive = 1

END

GO



CREATE PROCEDURE ConditionInsert
	@ProjectID int,
	@ActivityID int,
	@DependencyID int,
	@CompletionPercentage float,
	@ConditionTypeID int

AS

BEGIN

DECLARE @ID int

INSERT ProjectCondition (ProjectID,ActivityID,DependencyID,CompletionPercentage,ConditionTypeID,isActive)

VALUES (@ProjectID,
		@ActivityID,
		@DependencyID,
		@CompletionPercentage,
		@ConditionTypeID,
		1)


SELECT @ID = @@IDENTITY

SELECT @ID as 'Key value returned in a result set'

END

GO


CREATE PROCEDURE [dbo].[ConditionUpdate]
	@ProjectID int,
	@ActivityID int,
	@DependencyID int,
	@CompletionPercentage float

AS

BEGIN

UPDATE	ProjectCondition
SET		CompletionPercentage = @CompletionPercentage
WHERE	ProjectID = @ProjectID
AND		ActivityID = @ActivityID
AND		DependencyID = @DependencyID

END


GO

CREATE PROCEDURE ConditionDelete
	@ProjectID int,
	@ActivityID int,
	@DependencyID int,
	@ConditionTypeID int

AS

BEGIN

DELETE ProjectCondition
WHERE	ProjectID = @ProjectID
AND		ActivityID = @ActivityID
AND		DependencyID = @DependencyID
AND		ConditionTypeID = @ConditionTypeID

END

GO