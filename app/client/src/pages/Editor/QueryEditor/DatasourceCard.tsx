import { Datasource } from "entities/Datasource";
import { isStoredDatasource } from "entities/Action";
import { BaseButton } from "components/designSystems/blueprint/ButtonComponent";
import React from "react";
import { isNil } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "constants/Colors";
import { useParams } from "react-router";

import {
  getPluginImages,
  getQueryActionsForCurrentPage,
} from "selectors/entitiesSelector";
import styled from "styled-components";
import { AppState } from "reducers";
import history from "utils/history";

import { renderDatasourceSection } from "pages/Editor/DataSourceEditor/DatasourceSection";
import { DATA_SOURCES_EDITOR_ID_URL } from "constants/routes";
import { setDatsourceEditorMode } from "actions/datasourceActions";

const Wrapper = styled.div`
  border: 2px solid #d6d6d6;
  padding: 18px;
  margin-top: 18px;
`;

const ActionButton = styled(BaseButton)`
  &&&& {
    height: 36px;
    max-width: 120px;
    width: auto;
  }
`;

const DatasourceImage = styled.img`
  height: 24px;
  width: auto;
`;

const EditDatasourceButton = styled(BaseButton)`
  &&&& {
    height: 36px;
    max-width: 160px;
    border: 1px solid ${Colors.GEYSER_LIGHT};
    width: auto;
  }
`;

const DatasourceName = styled.span`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
`;

const DatasourceCardHeader = styled.div`
  justify-content: space-between;
  display: flex;
`;

const DatasourceNameWrapper = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
`;

const Queries = styled.div`
  color: ${Colors.DOVE_GRAY};
  font-size: 14px;
  display: inline-block;
  margin-top: 11px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

type DatasourceCardProps = {
  datasource: Datasource;
  onCreateQuery: (datasource: Datasource) => void;
};

function DatasourceCard(props: DatasourceCardProps) {
  const dispatch = useDispatch();
  const pluginImages = useSelector(getPluginImages);
  const params = useParams<{ applicationId: string; pageId: string }>();
  const { datasource } = props;
  const datasourceFormConfigs = useSelector(
    (state: AppState) => state.entities.plugins.formConfigs,
  );
  const queryActions = useSelector(getQueryActionsForCurrentPage);
  const queriesWithThisDatasource = queryActions.filter(
    (action) =>
      "datasource" in action.config &&
      isStoredDatasource(action.config.datasource) &&
      action.config.datasource.id === datasource.id,
  ).length;

  const currentFormConfig: Array<any> =
    datasourceFormConfigs[datasource?.pluginId ?? ""];
  const QUERY = queriesWithThisDatasource > 1 ? "queries" : "query";

  const editDatasource = () => {
    dispatch(setDatsourceEditorMode({ id: datasource.id, viewMode: false }));
    history.push(
      DATA_SOURCES_EDITOR_ID_URL(
        params.applicationId,
        params.pageId,
        datasource.id,
      ),
    );
  };

  return (
    <Wrapper>
      <DatasourceCardHeader className="t--datasource-name">
        <div style={{ flex: 1 }}>
          <DatasourceNameWrapper>
            <DatasourceImage
              alt="Datasource"
              className="dataSourceImage"
              src={pluginImages[datasource.pluginId]}
            />
            <DatasourceName>{datasource.name}</DatasourceName>
          </DatasourceNameWrapper>
          <Queries>
            {queriesWithThisDatasource
              ? `${queriesWithThisDatasource} ${QUERY} on this page`
              : "No query is using this datasource"}
          </Queries>
        </div>
        <ButtonsWrapper>
          <EditDatasourceButton
            className="t--edit-datasource"
            icon={"edit"}
            onClick={editDatasource}
            text="Edit Datasource"
          />
          <ActionButton
            accent="primary"
            className="t--create-query"
            filled
            icon={"plus"}
            onClick={() => props.onCreateQuery(datasource)}
            text="New Query"
          />
        </ButtonsWrapper>
      </DatasourceCardHeader>
      {!isNil(currentFormConfig)
        ? renderDatasourceSection(currentFormConfig[0], datasource)
        : undefined}
    </Wrapper>
  );
}

export default DatasourceCard;
